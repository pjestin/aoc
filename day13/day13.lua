local StringUtils = require("lib.string-utils")
local Vector = require("lib.vector")

local Day13 = {}

function Day13.parse_dots(lines)
    local dots = {}
    local fold_instructions = {}
    local passed_blank_line = false

    for _, line in ipairs(lines) do
        if line:len() == 0 then
            passed_blank_line = true
        elseif not passed_blank_line then
            local split_line = StringUtils.split(line, ",")
            local x = tonumber(split_line[1])
            local y = tonumber(split_line[2])
            local vector = Vector:new{
                x = x,
                y = y
            }
            dots[vector:to_string()] = vector
        else
            for direction, coordinate in line:gmatch("fold along (%w)=(%d+)") do
                table.insert(fold_instructions, {
                    direction = direction,
                    coordinate = tonumber(coordinate)
                })
            end
        end
    end

    return dots, fold_instructions
end

function Day13.fold(dots, instruction)
    local new_dots = {}
    for dot_string, dot in pairs(dots) do
        local new_dot = instruction.direction == "x" and Vector:new{
            x = 2 * instruction.coordinate - dot.x,
            y = dot.y
        } or Vector:new{
            x = dot.x,
            y = 2 * instruction.coordinate - dot.y
        }
        if (instruction.direction == "x" and new_dot.x < instruction.coordinate) or
            (instruction.direction == "y" and new_dot.y < instruction.coordinate) then
            new_dots[new_dot:to_string()] = new_dot
        else
            new_dots[dot:to_string()] = dot
        end
    end
    return new_dots
end

function Day13.dots_to_string(dots)
    local min_x = nil
    local max_x = nil
    local min_y = nil
    local max_y = nil
    for _, dot in pairs(dots) do
        if not min_x or dot.x < min_x then
            min_x = dot.x
        end
        if not max_x or dot.x > max_x then
            max_x = dot.x
        end
        if not min_y or dot.y < min_y then
            min_y = dot.y
        end
        if not max_y or dot.y > max_y then
            max_y = dot.y
        end
    end

    local dot_table = {}
    for y = min_y, max_y do
        local dot_row = {}
        for x = min_x, max_x do
            if dots[Vector:new{
                x = x,
                y = y
            }:to_string()] then
                table.insert(dot_row, "#")
            else
                table.insert(dot_row, ".")
            end
        end
        table.insert(dot_table, table.concat(dot_row))
    end

    return dot_table
end

function Day13.count_dots_after_fold(lines)
    local dots, fold_instructions = Day13.parse_dots(lines)

    dots = Day13.fold(dots, fold_instructions[1])

    local count_dots = 0
    for _, _ in pairs(dots) do
        count_dots = count_dots + 1
    end

    return count_dots
end

function Day13.display_dots_after_folds(lines)
    local dots, fold_instructions = Day13.parse_dots(lines)

    for _, instruction in ipairs(fold_instructions) do
        dots = Day13.fold(dots, instruction)
    end

    return Day13.dots_to_string(dots)
end

return Day13
