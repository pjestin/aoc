local StringUtils = require("lib.string-utils")
local Vector = require("lib.vector")

local Day05 = {}

function Day05.parse_line(line)
    local split_line = {}
    for group in line:gmatch("%d+") do
        split_line[#split_line + 1] = group
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

function Day05.count_overlaps(lines)
    local points = {}
    local nb_overlap = 0

    for _, line in ipairs(lines) do
        local origin, termination = Day05.parse_line(line)
        local line_points = {}

        if origin.x == termination.x then
            if origin.y < termination.y then
                for y = origin.y, termination.y do
                    line_points[#line_points + 1] = Vector:new{
                        x = origin.x,
                        y = y
                    }
                end
            else
                for y = termination.y, origin.y do
                    line_points[#line_points + 1] = Vector:new{
                        x = origin.x,
                        y = y
                    }
                end
            end
        end

        if origin.y == termination.y then
            if origin.x < termination.x then
                for x = origin.x, termination.x do
                    line_points[#line_points + 1] = Vector:new{
                        x = x,
                        y = origin.y
                    }
                end
            else
                for x = termination.x, origin.x do
                    line_points[#line_points + 1] = Vector:new{
                        x = x,
                        y = origin.y
                    }
                end
            end
        end

        for _, line_point in ipairs(line_points) do
            local line_point_string = line_point:to_string()
            points[line_point_string] = (points[line_point_string] or 0) + 1
            if points[line_point_string] == 2 then
                nb_overlap = nb_overlap + 1
            end
        end
    end

    return nb_overlap
end

return Day05
