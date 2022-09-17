local Vector = require("lib.vector")

local Day09 = {}

function Day09.parse_height_map(lines)
    local height_map = {}
    for y, row in ipairs(lines) do
        local height_map_row = {}
        for height_string in row:gmatch("%d") do
            local height = tonumber(height_string)
            table.insert(height_map_row, height)
        end
        height_map[y] = height_map_row
    end
    return height_map
end

function Day09.find_neighbours(position, height_map)
    local neighbours = {Vector:new{
        x = position.x,
        y = position.y - 1
    }, Vector:new{
        x = position.x,
        y = position.y + 1
    }, Vector:new{
        x = position.x - 1,
        y = position.y
    }, Vector:new{
        x = position.x + 1,
        y = position.y
    }}
    local neighbour_heights = {}
    for _, neighbour in ipairs(neighbours) do
        if neighbour.y >= 1 and neighbour.y <= #height_map and neighbour.x >= 1 and neighbour.x <= #height_map[1] then
            local neighbour_height = height_map[neighbour.y][neighbour.x]
            table.insert(neighbour_heights, {
                position = neighbour,
                height = neighbour_height
            })
        end
    end
    return neighbour_heights
end

function Day09.find_low_points(height_map)
    local low_points = {}
    for y = 1, #height_map do
        for x = 1, #height_map[1] do
            local height = height_map[y][x]
            local neighbours = Day09.find_neighbours(Vector:new{
                x = x,
                y = y
            }, height_map)
            local is_low_point = true
            for _, neighbour in ipairs(neighbours) do
                if neighbour.height <= height then
                    is_low_point = false
                    break
                end
            end
            if is_low_point then
                table.insert(low_points, Vector:new{
                    x = x,
                    y = y
                })
            end
        end
    end
    return low_points
end

function Day09.count_low_point_risk(lines)
    local height_map = Day09.parse_height_map(lines)
    local low_points = Day09.find_low_points(height_map)

    local risk_sum = 0
    for _, low_point in ipairs(low_points) do
        local height = height_map[low_point.y][low_point.x]
        risk_sum = risk_sum + height + 1
    end

    return risk_sum
end

function Day09.find_basin(position, basin_by_position, height_map)
    local height = height_map[position.y][position.x]
    local min_neighbour_height = nil
    local min_neighbour = nil
    local neighbours = Day09.find_neighbours(position, height_map)
    for _, neighbour in ipairs(neighbours) do
        if (min_neighbour_height == nil or neighbour.height < min_neighbour_height) and neighbour.height < height then
            min_neighbour_height = neighbour.height
            min_neighbour = neighbour
        end
    end

    if min_neighbour == nil then
        basin_by_position[position:hash()] = position
    else
        local min_neighbour_position_string = min_neighbour.position:hash()
        if basin_by_position[min_neighbour_position_string] == nil then
            Day09.find_basin(min_neighbour.position, basin_by_position, height_map)
        end
        basin_by_position[position:hash()] = basin_by_position[min_neighbour_position_string]
    end
end

function Day09.find_largest_basins(lines)
    local height_map = Day09.parse_height_map(lines)
    local basins_by_position = {}
    for y = 1, #height_map do
        for x = 1, #height_map[1] do
            local height = height_map[y][x]
            if height < 9 then
                local position = Vector:new{
                    x = x,
                    y = y
                }
                Day09.find_basin(position, basins_by_position, height_map)
            end
        end
    end

    local basin_sizes = {}
    for position_string, basin_position in pairs(basins_by_position) do
        local basin_position_string = basin_position:hash()
        basin_sizes[basin_position_string] = (basin_sizes[basin_position_string] or 0) + 1
    end

    local basin_size_table = {}
    for i, basin_size in pairs(basin_sizes) do
        table.insert(basin_size_table, basin_size)
    end
    table.sort(basin_size_table)

    return basin_size_table[#basin_size_table] * basin_size_table[#basin_size_table - 1] *
               basin_size_table[#basin_size_table - 2]
end

return Day09
