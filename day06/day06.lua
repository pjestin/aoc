local StringUtils = require("lib.string-utils")

local Day06 = {}

function Day06.parse_fish(line)
    local numbers_string = StringUtils.split(line, ",")
    local lanternfish = {}
    for _, number_string in ipairs(numbers_string) do
        local number = tonumber(number_string)
        lanternfish[number] = (lanternfish[number] or 0) + 1
    end
    return lanternfish
end

function Day06.count_lanternfish(line, days)
    local lanternfish = Day06.parse_fish(line)

    for _ = 1, days do
        local fish_to_give_birth = lanternfish[0] or 0
        lanternfish[0] = lanternfish[1] or 0
        lanternfish[1] = lanternfish[2] or 0
        lanternfish[2] = lanternfish[3] or 0
        lanternfish[3] = lanternfish[4] or 0
        lanternfish[4] = lanternfish[5] or 0
        lanternfish[5] = lanternfish[6] or 0
        lanternfish[6] = (lanternfish[7] or 0) + fish_to_give_birth
        lanternfish[7] = lanternfish[8] or 0
        lanternfish[8] = fish_to_give_birth
    end

    local total_fish = 0
    for _, nb_fish in pairs(lanternfish) do
        total_fish = total_fish + nb_fish
    end
    return total_fish
end

return Day06
