local Vector = require("lib.vector")

local Day17 = {}

function Day17.parse_target_area(line)
    for min_x, max_x, min_y, max_y in line:gmatch("target area: x=(-?%d+)..(-?%d+), y=(-?%d+)..(-?%d+)") do
        return {
            min = Vector:new{
                x = tonumber(min_x),
                y = tonumber(min_y)
            },
            max = Vector:new{
                x = tonumber(max_x),
                y = tonumber(max_y)
            }
        }
    end
end

function Day17.shoot(speed, target_area)
    local max_y = 0
    local position = Vector:new{
        x = 0,
        y = 0
    }
    while position.x < target_area.max.x and position.y > target_area.min.y do
        position:add(speed)
        if speed.x > 0 then
            speed.x = speed.x - 1
        elseif speed.x < 0 then
            speed.x = speed.x + 1
        end
        speed.y = speed.y - 1

        if position.y > max_y then
            max_y = position.y
        end

        if position.x >= target_area.min.x and position.x <= target_area.max.x and position.y >= target_area.min.y and
            position.y <= target_area.max.y then
            return {
                in_target_area = true,
                max_y = max_y
            }
        end
    end

    return {
        in_target_area = false
    }
end

function Day17.find_highest_position(line)
    local target_area = Day17.parse_target_area(line)

    local max_y = 0
    for x_speed = 1, target_area.max.x do
        for y_speed = target_area.min.y, target_area.max.y + target_area.max.x do
            local shot = Day17.shoot(Vector:new{
                x = x_speed,
                y = y_speed
            }, target_area)
            if shot.in_target_area and shot.max_y > max_y then
                max_y = shot.max_y
            end
        end
    end

    return max_y
end

function Day17.count_velocity_values(line)
    local target_area = Day17.parse_target_area(line)

    local count = 0
    for x_speed = 1, target_area.max.x do
        for y_speed = target_area.min.y, target_area.max.y + target_area.max.x do
            local shot = Day17.shoot(Vector:new{
                x = x_speed,
                y = y_speed
            }, target_area)
            if shot.in_target_area then
                count = count + 1
            end
        end
    end

    return count
end

return Day17
