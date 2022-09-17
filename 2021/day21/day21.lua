local Queue = require("lib.queue")
local TableUtils = require("lib.table-utils")

local Day21 = {}

local DeterministicDie = {}

function DeterministicDie:new(o)
    o = o or {next_roll = 1}
    setmetatable(o, self)
    self.__index = self
    return o
end

function DeterministicDie:roll()
    local next_roll = self.next_roll
    self.next_roll = (self.next_roll % 100) + 1
    return next_roll
end

function Day21.parse_starting_positions(lines)
    local starting_positions = {}
    for player = 1, 2 do
        for start in lines[player]:gmatch("Player %d starting position: (%d)") do
            starting_positions[player] = tonumber(start)
        end
    end
    return starting_positions
end

function Day21.play_deterministic_dice(lines)
    local positions = Day21.parse_starting_positions(lines)
    local die = DeterministicDie:new()

    local scores = {0, 0}
    local player = 1
    local count_roll = 0
    
    while scores[1] < 1000 and scores[2] < 1000 do
        local roll_sum = 0
        for die_roll = 1, 3 do
            local roll = die:roll()
            roll_sum = roll_sum + roll
            count_roll = count_roll + 1
        end
        positions[player] = (positions[player] + roll_sum - 1) % 10 + 1
        scores[player] = scores[player] + positions[player]
        player = player % 2 + 1
    end

    return scores[player] * count_roll
end

Day21.DICE_WEIGHT = {
    [3] = 1,
    [4] = 3,
    [5] = 6,
    [6] = 7,
    [7] = 6,
    [8] = 3,
    [9] = 1
}

function Day21.play_dirac_dice(lines)
    local starting_positions = Day21.parse_starting_positions(lines)
    local win_times = {0, 0}
    local q = Queue:new()
    q:push({
        position_1 = starting_positions[1],
        position_2 = starting_positions[2],
        score_1 = 0,
        score_2 = 0,
        player_turn = 1,
        weight = 1
    })

    while not q:is_empty() do
        local state = q:pop()
        local player = state.player_turn
        for dice, dice_weight in pairs(Day21.DICE_WEIGHT) do
            local weight = state.weight * dice_weight
            local position = player == 1 and state.position_1 or state.position_2
            local score = player == 1 and state.score_1 or state.score_2
            position = (position + dice - 1) % 10 + 1
            score = score + position
            if score >= 21 then
                win_times[player] = win_times[player] + weight
            else
                q:push({
                    position_1 = player == 1 and position or state.position_1,
                    position_2 = player == 2 and position or state.position_2,
                    score_1 = player == 1 and score or state.score_1,
                    score_2 = player == 2 and score or state.score_2,
                    player_turn = player % 2 + 1,
                    weight = weight
                })
            end
        end
    end

    return TableUtils.max(win_times)
end

return Day21
