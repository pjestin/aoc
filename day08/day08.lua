local Day08 = {}

Day08.SEGMENTS = {"a", "b", "c", "d", "e", "f", "g"}

Day08.DIGIT_MAP = {
    abcefg = 0,
    cf = 1,
    acdeg = 2,
    acdfg = 3,
    bcdf = 4,
    abdfg = 5,
    abdefg = 6,
    acf = 7,
    abcdefg = 8,
    abcdfg = 9
}

function Day08.parse_digit_sets(lines)
    local digit_sets = {}
    for i, line in ipairs(lines) do
        local digit_set = {
            unique = {},
            output = {}
        }

        local digit_index = 1
        for digit in line:gmatch("%w+") do
            if digit_index <= 10 then
                digit_set.unique[digit_index] = digit
            else
                digit_set.output[digit_index - 10] = digit
            end
            digit_index = digit_index + 1
        end

        digit_sets[i] = digit_set
    end
    return digit_sets
end

function Day08.count_easy_digits(lines)
    local digit_sets = Day08.parse_digit_sets(lines)

    local count = 0
    for _, digit_set in ipairs(digit_sets) do
        for _, output_digit in ipairs(digit_set.output) do
            local digit_length = output_digit:len()
            if digit_length == 2 or digit_length == 3 or digit_length == 4 or digit_length == 7 then
                count = count + 1
            end
        end
    end

    return count
end

function Day08.find_segment_mapping(unique_digits)
    local possible_mappings = {}
    for _, segment in ipairs(Day08.SEGMENTS) do
        possible_mappings[segment] = {}
        for i, value in ipairs(Day08.SEGMENTS) do
            possible_mappings[segment][value] = true
        end
    end

    for _, unique_digit in ipairs(unique_digits) do
        local digit_length = unique_digit:len()
        for _, segment in ipairs(Day08.SEGMENTS) do
            if unique_digit:find(segment) then
                if digit_length == 2 then
                    possible_mappings[segment]["a"] = nil
                    possible_mappings[segment]["b"] = nil
                    possible_mappings[segment]["d"] = nil
                    possible_mappings[segment]["e"] = nil
                    possible_mappings[segment]["g"] = nil
                elseif digit_length == 3 then
                    possible_mappings[segment]["b"] = nil
                    possible_mappings[segment]["d"] = nil
                    possible_mappings[segment]["e"] = nil
                    possible_mappings[segment]["g"] = nil
                elseif digit_length == 4 then
                    possible_mappings[segment]["a"] = nil
                    possible_mappings[segment]["e"] = nil
                    possible_mappings[segment]["g"] = nil
                end
            else
                if digit_length == 2 then
                    possible_mappings[segment]["c"] = nil
                    possible_mappings[segment]["f"] = nil
                elseif digit_length == 3 then
                    possible_mappings[segment]["a"] = nil
                    possible_mappings[segment]["c"] = nil
                    possible_mappings[segment]["f"] = nil
                elseif digit_length == 4 then
                    possible_mappings[segment]["b"] = nil
                    possible_mappings[segment]["c"] = nil
                    possible_mappings[segment]["d"] = nil
                    possible_mappings[segment]["f"] = nil
                elseif digit_length == 5 then
                    possible_mappings[segment]["a"] = nil
                    possible_mappings[segment]["d"] = nil
                    possible_mappings[segment]["g"] = nil
                elseif digit_length == 6 then
                    possible_mappings[segment]["a"] = nil
                    possible_mappings[segment]["b"] = nil
                    possible_mappings[segment]["f"] = nil
                    possible_mappings[segment]["g"] = nil
                end
            end
        end
    end

    local mappings = {}
    local mapping_size = 0
    while mapping_size < #Day08.SEGMENTS do
        for _, segment in ipairs(Day08.SEGMENTS) do
            local possible_mapping_length = 0
            local mapping = nil
            for possible_mapping in pairs(possible_mappings[segment]) do
                possible_mapping_length = possible_mapping_length + 1
                mapping = possible_mapping
            end
            if possible_mapping_length == 1 then
                mappings[segment] = mapping
                mapping_size = mapping_size + 1
                for _, other_segment in ipairs(Day08.SEGMENTS) do
                    possible_mappings[other_segment][mapping] = nil
                end
            end
        end
    end

    return mappings
end

function Day08.decode_with_mapping(output_digits, mapping)
    local decoded_number = 0
    for _, digit in ipairs(output_digits) do
        local decoded_digit = {}
        for i = 1, #digit do
            local segment = digit:sub(i, i)
            local decoded_segment = mapping[segment]
            decoded_digit[i] = decoded_segment
        end
        table.sort(decoded_digit)
        local decoded_digit_string = table.concat(decoded_digit)
        local decoded_digit_number = Day08.DIGIT_MAP[decoded_digit_string]
        decoded_number = 10 * decoded_number + decoded_digit_number
    end
    return decoded_number
end

function Day08.decode_digits(lines)
    local digit_sets = Day08.parse_digit_sets(lines)

    local sum = 0
    for _, digit_set in ipairs(digit_sets) do
        local mapping = Day08.find_segment_mapping(digit_set.unique)
        local result = Day08.decode_with_mapping(digit_set.output, mapping)
        sum = sum + result
    end

    return sum
end

return Day08
