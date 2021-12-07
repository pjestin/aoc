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

function Day07.find_minimum_fuel_median(line)
    local crab_positions = Day07.parse_crab_positions(line)

    table.sort(crab_positions)
    local median_position = crab_positions[#crab_positions / 2]

    local minimum_fuel = 0
    for _, crab_position in ipairs(crab_positions) do
        minimum_fuel = minimum_fuel + math.abs(median_position - crab_position)
    end

    return minimum_fuel
end

function Day07.find_min_max_positions(crab_positions)
    local min_position = nil
    local max_position = nil
    for _, crab_position in ipairs(crab_positions) do
        if not min_position or crab_position < min_position then
            min_position = crab_position
        end
        if not max_position or crab_position > max_position then
            max_position = crab_position
        end
    end
    return min_position, max_position
end

function Day07.calculate_fuel(crab_positions, target)
    local fuel = 0
    for _, crab_position in ipairs(crab_positions) do
        local delta = math.abs(crab_position - target)
        fuel = fuel + delta * (delta + 1) / 2
    end
    return fuel
end

function Day07.find_minimum_fuel_quadratic(line)
    local crab_positions = Day07.parse_crab_positions(line)
    local min_position, max_position = Day07.find_min_max_positions(crab_positions)

    local previous_fuel = nil
    for target = min_position, max_position do
        local fuel = Day07.calculate_fuel(crab_positions, target)
        if previous_fuel and fuel > previous_fuel then
            return previous_fuel
        end
        previous_fuel = fuel
    end

    error("Minimum fuel not found")
end

return Day07
