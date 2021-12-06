local StringUtils = require("lib.string-utils")

local Day06 = {}

function Day06.parse_fish(line)
    local numbers_string = StringUtils.split(line, ",")
    local lanternfish = {}
    for i, number_string in ipairs(numbers_string) do
        lanternfish[i] = tonumber(number_string)
    end
    return lanternfish
end

function Day06.count_lanternfish(line)
    local lanternfish = Day06.parse_fish(line)

    for _ = 1, 80 do
        for i = 1, #lanternfish do
            if lanternfish[i] == 0 then
                lanternfish[i] = 6
                lanternfish[#lanternfish + 1] = 8
            else
                lanternfish[i] = lanternfish[i] - 1
            end
        end
    end

    return #lanternfish
end

return Day06
