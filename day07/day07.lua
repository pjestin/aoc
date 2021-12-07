local StringUtils = require("lib.string-utils")

local Day07 = {}

function Day07.parse_crab_positions(line)
    local split_line = StringUtils.split(line, ",")
    local crab_positions = {}
    for i, position_string in ipairs(split_line) do
        crab_positions[i] = tonumber(position_string)
    end
    return crab_positions
end

function Day07.find_minimum_fuel(crab_positions, initial_target, fuel_function)
    local target = initial_target
    while true do
        local current_fuel = fuel_function(crab_positions, target)
        local previous_fuel = fuel_function(crab_positions, target - 1)
        local next_fuel = fuel_function(crab_positions, target + 1)
        if current_fuel <= previous_fuel and current_fuel <= next_fuel then
            return current_fuel
        elseif current_fuel > previous_fuel then
            target = target - 1
        else
            target = target + 1
        end
    end
end

function Day07.calculate_fuel_simple(crab_positions, target)
    local fuel = 0
    for _, crab_position in ipairs(crab_positions) do
        local delta = math.abs(crab_position - target)
        fuel = fuel + delta
    end
    return fuel
end

function Day07.find_minimum_fuel_simple(line)
    local crab_positions = Day07.parse_crab_positions(line)

    table.sort(crab_positions)
    local median_position = crab_positions[#crab_positions / 2]

    return Day07.find_minimum_fuel(crab_positions, median_position, Day07.calculate_fuel_simple)
end

function Day07.calculate_fuel_quadratic(crab_positions, target)
    local fuel = 0
    for _, crab_position in ipairs(crab_positions) do
        local delta = math.abs(crab_position - target)
        fuel = fuel + delta * (delta + 1) / 2
    end
    return fuel
end

function Day07.find_minimum_fuel_quadratic(line)
    local crab_positions = Day07.parse_crab_positions(line)

    local sum = 0
    for _, crab_position in ipairs(crab_positions) do
        sum = sum + crab_position
    end
    local mean = sum / #crab_positions

    return Day07.find_minimum_fuel(crab_positions, math.floor(mean), Day07.calculate_fuel_quadratic)
end

return Day07
