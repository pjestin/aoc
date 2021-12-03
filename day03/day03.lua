local Day03 = {}

function Day03:power_consumption(lines)
    local most_common = {}
    local least_common = {}
    for i = 1, string.len(lines[1]) do
        local sum = 0
        for _, line in ipairs(lines) do
            sum = sum + tonumber(line:sub(i, i))
        end
        if sum >= #lines / 2 then
            most_common[i] = 1
            least_common[i] = 0
        else
            most_common[i] = 0
            least_common[i] = 1
        end
    end
    local gamma_rate = tonumber(table.concat(most_common), 2)
    local epsilon_rate = tonumber(table.concat(least_common), 2)
    return gamma_rate * epsilon_rate
end

return Day03
