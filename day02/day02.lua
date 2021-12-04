local Vector = require("lib.vector")
local StringUtils = require("lib.string-utils")

local Day02 = {}

function Day02.move_submarine(lines)
    local position = Vector:new{
        x = 0,
        y = 0
    }

    for i, instruction in ipairs(lines) do
        local split_instruction = StringUtils.split(instruction)
        local direction = split_instruction[1]
        local amount = tonumber(split_instruction[2])

        if direction == "forward" then
            position.x = position.x + amount
        elseif direction == "up" then
            position.y = position.y - amount
        elseif direction == "down" then
            position.y = position.y + amount
        end
    end

    return position.x * position.y
end

function Day02.move_submarine_aim(lines)
    local position = Vector:new{
        x = 0,
        y = 0
    }
    local aim = 0

    for i, instruction in ipairs(lines) do
        local split_instruction = StringUtils.split(instruction)
        local direction = split_instruction[1]
        local amount = tonumber(split_instruction[2])

        if direction == "forward" then
            position.x = position.x + amount
            position.y = position.y + amount * aim
        elseif direction == "up" then
            aim = aim - amount
        elseif direction == "down" then
            aim = aim + amount
        end
    end

    return position.x * position.y
end

return Day02
