local PriorityQueue = require("lib.priority-queue")
local TableUtils = require("lib.table-utils")

local Day23 = {}

Day23.ENERGY_MAP = {
    A = 1,
    B = 10,
    C = 100,
    D = 1000
}

Day23.DESTINATION_MAP = {
    A = 1,
    B = 2,
    C = 3,
    D = 4
}

Day23.HALLWAY_STOP_PLACES = {1, 2, 4, 6, 8, 10, 11}

function Day23.parse_initial_state(lines)
    local rooms = {{}, {}, {}, {}}
    for i = 3, 4 do
        local room_number = 1
        for amphipod in lines[i]:gmatch("%w") do
            rooms[room_number][i - 2] = amphipod
            room_number = room_number + 1
        end
    end
    return rooms
end

function Day23.parse_initial_state_with_extra_lines(lines, extra_lines)
    local rooms = {{}, {}, {}, {}}
    for i = 3, 4 do
        local room_number = 1
        for amphipod in lines[i]:gmatch("%w") do
            if i == 3 then
                rooms[room_number][1] = amphipod
            else
                rooms[room_number][4] = amphipod
            end
            room_number = room_number + 1
        end
    end
    for i = 1, 2 do
        local room_number = 1
        for amphipod in extra_lines[i]:gmatch("%w") do
            rooms[room_number][i + 1] = amphipod
            room_number = room_number + 1
        end
    end
    return rooms
end

function Day23.hallway_coordinate(room_index)
    return 2 * room_index + 1
end

function Day23.move_amphipod_to_hallway(rooms, room_index, coordinate_in_room, hallway, stop_place)
    local new_hallway = TableUtils.copy(hallway)
    local new_rooms = TableUtils.copy(rooms)
    local amphipod_type = rooms[room_index][coordinate_in_room]
    new_hallway[stop_place] = amphipod_type
    new_rooms[room_index][coordinate_in_room] = nil
    local room_coordinate = Day23.hallway_coordinate(room_index)
    local energy_surplus = Day23.ENERGY_MAP[amphipod_type] *
                               (math.abs(room_coordinate - stop_place) + coordinate_in_room)
    return new_rooms, new_hallway, energy_surplus
end

function Day23.organised(rooms, room_size)
    for i = 1, room_size do
        if rooms[1][i] ~= "A" or rooms[2][i] ~= "B" or rooms[3][i] ~= "C" or rooms[4][i] ~= "D" then
            return false
        end
    end
    return true
end

function Day23.obstacle(hallway, coordinate, stop_place)
    local direction = coordinate < stop_place and 1 or -1
    for index = coordinate + direction, stop_place, direction do
        if hallway[index] then
            return true
        end
    end
    return false
end

function Day23.move_amphipod_to_room(hallway, hallway_coordinate, rooms, destination, coordinate_in_room)
    local amphipod_type = hallway[hallway_coordinate]
    local new_hallway = TableUtils.copy(hallway)
    local new_rooms = TableUtils.copy(rooms)
    new_hallway[hallway_coordinate] = nil
    new_rooms[destination][coordinate_in_room] = amphipod_type
    local room_coordinate = Day23.hallway_coordinate(destination)
    local energy_surplus = Day23.ENERGY_MAP[amphipod_type] *
                               (math.abs(room_coordinate - hallway_coordinate) + coordinate_in_room)
    return new_rooms, new_hallway, energy_surplus
end

function Day23.state_to_string(state, room_size)
    local result = room_size == 2 and
                       {"#############", "#...........#", "###.#.#.#.###", "  #.#.#.#.#  ", "  #########  "} or
                       {"#############", "#...........#", "###.#.#.#.###", "  #.#.#.#.#  ", "  #.#.#.#.#  ",
                        "  #.#.#.#.#  ", "  #########  "}
    for hallway_index = 1, 11 do
        if state.hallway[hallway_index] then
            result[2] = result[2]:sub(1, hallway_index) .. state.hallway[hallway_index] ..
                            result[2]:sub(hallway_index + 2, #result[2])
        end
    end
    for room_index, room in ipairs(state.rooms) do
        for i = 1, room_size do
            if room[i] then
                result[i + 2] = result[i + 2]:sub(1, 2 * room_index + 1) .. room[i] ..
                                    result[i + 2]:sub(2 * room_index + 3, #result[i + 2])
            end
        end
    end
    return table.concat(result, "\n")
end

function Day23.state_hash(state, room_size)
    local hash = 0
    for hallway_index = 1, 11 do
        if state.hallway[hallway_index] then
            hash = hash + math.pow(4, hallway_index) * Day23.DESTINATION_MAP[state.hallway[hallway_index]]
        end
    end
    for room_index, room in ipairs(state.rooms) do
        for i = 1, room_size do
            if room[i] then
                hash = hash + math.pow(4, 11 + 2 * room_index + i) * Day23.DESTINATION_MAP[room[i]]
            end
        end
    end
    return hash
end

function Day23.find_deepest_coordinate_in_room(room, room_size, room_index)
    for i = room_size, 1, -1 do
        local obstacle = false
        for j = 1, i do
            if room[j] then
                obstacle = true
                break
            end
        end
        if not obstacle then
            for j = i + 1, room_size do
                if Day23.DESTINATION_MAP[room[j]] ~= room_index then
                    return nil
                end
            end
            return i
        end
    end
    return nil
end

function Day23.can_move_out_of_room(room, coordinate_in_room, room_size, room_index)
    local should_move_out = false
    for i = coordinate_in_room, room_size do
        if Day23.DESTINATION_MAP[room[i]] ~= room_index then
            should_move_out = true
            break
        end
    end
    if not should_move_out then
        return false
    end
    for i = 1, coordinate_in_room - 1 do
        if room[i] then
            return false
        end
    end
    return true
end

function Day23.find_organised_state(initial_state, room_size)
    local visited = {}
    local q = PriorityQueue()
    q:put(initial_state, 0)

    while not q:empty() do
        local state = q:pop()

        if Day23.organised(state.rooms, room_size) then
            return state.energy
        end

        local state_hash = Day23.state_hash(state, room_size)
        if not visited[state_hash] then
            visited[state_hash] = true

            for hallway_coordinate = 1, 11 do
                if state.hallway[hallway_coordinate] then
                    local amphipod = state.hallway[hallway_coordinate]
                    local destination = Day23.DESTINATION_MAP[amphipod]
                    local destination_hallway_coordinate = Day23.hallway_coordinate(destination)
                    if not Day23.obstacle(state.hallway, hallway_coordinate, destination_hallway_coordinate) then
                        local coordinate_in_room = Day23.find_deepest_coordinate_in_room(state.rooms[destination],
                            room_size, destination)
                        if coordinate_in_room ~= nil then
                            local new_rooms, new_hallway, energy_surplus =
                                Day23.move_amphipod_to_room(state.hallway, hallway_coordinate, state.rooms, destination,
                                    coordinate_in_room)
                            local new_energy = state.energy + energy_surplus
                            q:put({
                                rooms = new_rooms,
                                hallway = new_hallway,
                                energy = new_energy
                            }, new_energy)
                        end
                    end
                end
            end

            for room_index, room in ipairs(state.rooms) do
                local hallway_coordinate = Day23.hallway_coordinate(room_index)
                for _, stop_place in ipairs(Day23.HALLWAY_STOP_PLACES) do
                    for coordinate_in_room = 1, room_size do
                        if room[coordinate_in_room] and
                            Day23.can_move_out_of_room(room, coordinate_in_room, room_size, room_index) and
                            not Day23.obstacle(state.hallway, hallway_coordinate, stop_place) and
                            not state.hallway[hallway_coordinate] then
                            local new_rooms, new_hallway, energy_surplus =
                                Day23.move_amphipod_to_hallway(state.rooms, room_index, coordinate_in_room,
                                    state.hallway, stop_place)
                            local new_energy = state.energy + energy_surplus
                            q:put({
                                rooms = new_rooms,
                                hallway = new_hallway,
                                energy = new_energy
                            }, new_energy)
                        end
                    end
                end
            end
        end
    end

    error("Organised state not found")
end

function Day23.find_least_energy_organisation(lines)
    local initial_rooms = Day23.parse_initial_state(lines)
    local initial_state = {
        rooms = initial_rooms,
        hallway = {},
        energy = 0
    }

    return Day23.find_organised_state(initial_state, #initial_state.rooms[1])
end

function Day23.find_least_energy_organisation_with_extra_lines(lines, extra_lines)
    local initial_rooms = Day23.parse_initial_state_with_extra_lines(lines, extra_lines)
    local initial_state = {
        rooms = initial_rooms,
        hallway = {},
        energy = 0
    }

    return Day23.find_organised_state(initial_state, #initial_state.rooms[1])
end

return Day23
