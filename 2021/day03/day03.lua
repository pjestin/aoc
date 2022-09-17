local Day03 = {}

function Day03.get_most_common(binaries, index)
    local sum = 0
    local size = 0
    for _, binary in pairs(binaries) do
        if binary then
            sum = sum + tonumber(binary:sub(index, index))
            size = size + 1
        end
    end
    if sum >= size / 2 then
        return 1
    else
        return 0
    end
end

function Day03.power_consumption(lines)
    local most_common = {}
    local least_common = {}
    for i = 1, #lines[1] do
        local current_most_common = Day03.get_most_common(lines, i)
        table.insert(most_common, current_most_common)
        table.insert(least_common, 1 - current_most_common)
    end
    local gamma_rate = tonumber(table.concat(most_common), 2)
    local epsilon_rate = tonumber(table.concat(least_common), 2)
    return gamma_rate * epsilon_rate
end

function Day03.life_support_rating(lines)
    local oxygen_generator = {}
    local co2_scrubber = {}
    for _, line in pairs(lines) do
        table.insert(oxygen_generator, line)
        table.insert(co2_scrubber, line)
    end

    local oxygen_generator_rating = nil
    local co2_scrubber_rating = nil

    for i = 1, string.len(lines[1]) do
        local most_common = Day03.get_most_common(oxygen_generator, i)
        local least_common = 1 - Day03.get_most_common(co2_scrubber, i)
        local oxygen_generator_size = 0
        local co2_scrubber_size = 0

        for j, binary in pairs(oxygen_generator) do
            if not oxygen_generator_rating and tonumber(binary:sub(i, i)) ~= most_common then
                oxygen_generator[j] = nil
            else
                oxygen_generator_size = oxygen_generator_size + 1
            end
        end

        for j, binary in pairs(co2_scrubber) do
            if not co2_scrubber_rating and tonumber(binary:sub(i, i)) ~= least_common then
                co2_scrubber[j] = nil
            else
                co2_scrubber_size = co2_scrubber_size + 1
            end
        end

        if oxygen_generator_size == 1 then
            for _, binary in pairs(oxygen_generator) do
                if binary then
                    oxygen_generator_rating = tonumber(binary, 2)
                end
            end
        end

        if co2_scrubber_size == 1 then
            for _, binary in pairs(co2_scrubber) do
                if binary then
                    co2_scrubber_rating = tonumber(binary, 2)
                end
            end
        end

        if oxygen_generator_rating and co2_scrubber_rating then
            break
        end
    end

    return oxygen_generator_rating * co2_scrubber_rating
end

return Day03
