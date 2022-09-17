local StringUtils = require("lib.string-utils")
local Vector = require("lib.vector")

local Day05 = {}

function Day05.parse_line(line)
    local split_line = {}
    for group in line:gmatch("%d+") do
        table.insert(split_line, group)
    end

    local origin_x = tonumber(split_line[1])
    local origin_y = tonumber(split_line[2])

    local termination_x = tonumber(split_line[3])
    local termination_y = tonumber(split_line[4])

    return Vector:new{
        x = origin_x,
        y = origin_y
    }, Vector:new{
        x = termination_x,
        y = termination_y
    }
end

function Day05.count_overlaps(lines, with_diagonal)
    local points = {}
    local nb_overlap = 0

    for _, line in ipairs(lines) do
        local origin, termination = Day05.parse_line(line)
        if with_diagonal or (origin.x == termination.x or origin.y == termination.y) then
            local line_points = origin:line_points(termination)

            for _, line_point in ipairs(line_points) do
                local line_point_string = line_point:hash()
                points[line_point_string] = (points[line_point_string] or 0) + 1
                if points[line_point_string] == 2 then
                    nb_overlap = nb_overlap + 1
                end
            end
        end
    end

    return nb_overlap
end

return Day05
