local StringUtils = require("lib.string-utils")

local Day14 = {}

function Day14.parse_insertions_rules(lines)
    local template = StringUtils.to_table(lines[1])

    local insertion_rules = {}
    for i = 3, #lines do
        for pair, insertion in lines[i]:gmatch("(%w%w) %-%> (%w)") do
            insertion_rules[pair] = insertion
        end
    end

    return template, insertion_rules
end

function Day14.find_most_least_common_counts(polymer)
    local counts = {}
    for _, element in ipairs(polymer) do
        counts[element] = (counts[element] or 0) + 1
    end

    local most_common_count = nil
    local least_common_count = nil
    for _, count in pairs(counts) do
        if not most_common_count or count > most_common_count then
            most_common_count = count
        end
        if not least_common_count or count < least_common_count then
            least_common_count = count
        end
    end

    return most_common_count, least_common_count
end

function Day14.find_polymer_chain(lines)
    local polymer, insertion_rules = Day14.parse_insertions_rules(lines)

    for _ = 1, 10 do
        local new_polymer = {}
        for i = 1, #polymer - 1 do
            local pair = polymer[i] .. polymer[i + 1]
            local insertion = insertion_rules[pair]
            table.insert(new_polymer, polymer[i])
            table.insert(new_polymer, insertion)
        end
        table.insert(new_polymer, polymer[#polymer])
        polymer = new_polymer
    end

    local most_common_count, least_common_count = Day14.find_most_least_common_counts(polymer)

    return most_common_count - least_common_count
end

return Day14
