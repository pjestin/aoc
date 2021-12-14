local StringUtils = require("lib.string-utils")
local TableUtils = require("lib.table-utils")

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

function Day14.find_element_counts(polymer, insertion_rules, steps_remaining, element_counts)
    local element_count_key = table.concat(polymer) .. ";" .. steps_remaining
    if steps_remaining == 0 then
        local counts = {}
        for _, element in ipairs(polymer) do
            counts[element] = (counts[element] or 0) + 1
        end

        element_counts[element_count_key] = counts
        return element_counts[element_count_key]
    else
        if element_counts[element_count_key] ~= nil then
            return element_counts[element_count_key]
        else
            local new_polymer = {}
            for i = 1, #polymer - 1 do
                local pair = polymer[i] .. polymer[i + 1]
                local insertion = insertion_rules[pair]
                table.insert(new_polymer, polymer[i])
                table.insert(new_polymer, insertion)
            end
            table.insert(new_polymer, polymer[#polymer])

            local counts = {}
            for i = 1, #new_polymer do
                local sub_polymer = {new_polymer[i], new_polymer[i + 1]}
                local sub_polymer_counts = Day14.find_element_counts(sub_polymer, insertion_rules, steps_remaining - 1,
                    element_counts)

                for element, count in pairs(sub_polymer_counts) do
                    counts[element] = (counts[element] or 0) + count
                end

                if i > 1 then
                    counts[new_polymer[i]] = counts[new_polymer[i]] - 1
                end
            end

            element_counts[element_count_key] = counts
            return counts
        end
    end
end

function Day14.find_polymer_chain(lines, nb_steps)
    local polymer, insertion_rules = Day14.parse_insertions_rules(lines)

    local element_counts = {}
    local counts = Day14.find_element_counts(polymer, insertion_rules, nb_steps, element_counts)

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

    return most_common_count - least_common_count
end

return Day14
