local Vector = require("lib.vector")

local Day25 = {}

function Day25.parse_sea_cucumbers(lines)
    local east_facing = {}
    local south_facing = {}

    for y, line in ipairs(lines) do
        for x = 1, #lines[1] do
            local position = Vector:new{x = x, y = y}
            if line:sub(x, x) == ">" then
                east_facing[position:hash()] = position
            elseif line:sub(x, x) == "v" then
                south_facing[position:hash()] = position
            end
        end
    end

    return {
        east_facing = east_facing,
        south_facing = south_facing,
        size = Vector:new{x = #lines[1], y = #lines}
    }
end

function Day25.move(sea_cucumbers)
    local count_moves = 0

    local new_east_facing = {}
    for _, cucumber in pairs(sea_cucumbers.east_facing) do
        local neighbour_position = Vector:new{x = cucumber.x % sea_cucumbers.size.x + 1, y = cucumber.y}
        local neighbour_position_hash = neighbour_position:hash()
        local cucumber_hash = cucumber:hash()
        if sea_cucumbers.east_facing[neighbour_position_hash] == nil and sea_cucumbers.south_facing[neighbour_position_hash] == nil then
            new_east_facing[neighbour_position_hash] = neighbour_position
            count_moves = count_moves + 1
        else
            new_east_facing[cucumber_hash] = cucumber
        end
    end
    sea_cucumbers.east_facing = new_east_facing

    local new_south_facing = {}
    for _, cucumber in pairs(sea_cucumbers.south_facing) do
        local neighbour_position = Vector:new{x = cucumber.x, y = cucumber.y % sea_cucumbers.size.y + 1}
        local neighbour_position_hash = neighbour_position:hash()
        local cucumber_hash = cucumber:hash()
        if sea_cucumbers.east_facing[neighbour_position_hash] == nil and sea_cucumbers.south_facing[neighbour_position_hash] == nil then
            new_south_facing[neighbour_position_hash] = neighbour_position
            count_moves = count_moves + 1
        else
            new_south_facing[cucumber_hash] = cucumber
        end
    end
    sea_cucumbers.south_facing = new_south_facing

    return count_moves > 0
end

function Day25.count_steps_until_immobile(lines)
    local sea_cucumbers = Day25.parse_sea_cucumbers(lines)

    local count_steps = 0

    while true do
        local moved = Day25.move(sea_cucumbers)
        count_steps = count_steps + 1
        if not moved then
            return count_steps
        end
    end
end

return Day25
