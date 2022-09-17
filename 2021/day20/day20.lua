local Vector = require("lib.vector")

local Day20 = {}

function Day20.parse_pixels(lines)
    local algorithm = {}
    for i = 1, #lines[1] do
        algorithm[i - 1] = lines[1]:sub(i, i) == "#"
    end

    local pixels = {}
    for i = 3, #lines do
        local row = lines[i]
        for x = 1, #row do
            if row:sub(x, x) == "#" then
                local position = Vector:new{
                    x = x,
                    y = i - 2
                }
                pixels[position:hash()] = position
            end
        end
    end

    return algorithm, pixels
end

function Day20.find_pixel_min_max(pixels)
    local min = Vector:new()
    local max = Vector:new()
    for _, pixel in pairs(pixels) do
        if not min.x or pixel.x < min.x then
            min.x = pixel.x
        end
        if not max.x or pixel.x > max.x then
            max.x = pixel.x
        end
        if not min.y or pixel.y < min.y then
            min.y = pixel.y
        end
        if not max.y or pixel.y > max.y then
            max.y = pixel.y
        end
    end
    return min, max
end

function Day20.enhance(algorithm, pixels, should_invert, input_inverted)
    local min, max = Day20.find_pixel_min_max(pixels)

    local new_pixels = {}
    for x = min.x - 1, max.x + 1 do
        for y = min.y - 1, max.y + 1 do
            local neighbour_binary_table = {}
            for _, neighbour in ipairs({Vector:new{
                x = x - 1,
                y = y - 1
            }, Vector:new{
                x = x,
                y = y - 1
            }, Vector:new{
                x = x + 1,
                y = y - 1
            }, Vector:new{
                x = x - 1,
                y = y
            }, Vector:new{
                x = x,
                y = y
            }, Vector:new{
                x = x + 1,
                y = y
            }, Vector:new{
                x = x - 1,
                y = y + 1
            }, Vector:new{
                x = x,
                y = y + 1
            }, Vector:new{
                x = x + 1,
                y = y + 1
            }}) do
                local pixel_lit = input_inverted ~= (pixels[neighbour:hash()] ~= nil)
                table.insert(neighbour_binary_table, pixel_lit and 1 or 0)
            end
            local area_value = tonumber(table.concat(neighbour_binary_table), 2)
            local new_value = algorithm[area_value]
            if should_invert ~= new_value then
                local position = Vector:new{
                    x = x,
                    y = y
                }
                new_pixels[position:hash()] = position
            end
        end
    end
    return new_pixels
end

function Day20.count_pixels(lines, nb_iterations)
    local algorithm, pixels = Day20.parse_pixels(lines)
    local inversion = algorithm[1]

    for i = 1, nb_iterations do
        local should_invert = inversion and i % 2 == 1
        local input_inverted = inversion and i % 2 == 0
        pixels = Day20.enhance(algorithm, pixels, should_invert, input_inverted)
    end

    local count_pixels = 0
    for _, _ in pairs(pixels) do
        count_pixels = count_pixels + 1
    end

    return count_pixels
end

return Day20
