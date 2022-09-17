local TableUtils = require("lib.table-utils")

local Day16 = {}

function Day16.hex_to_bin(hex)
    local binaries = {}
    for i = 1, #hex do
        local hex_char = hex:sub(i, i)
        local number = tonumber(hex_char, 16)
        local binary = {}
        for j = 3, 0, -1 do
            table.insert(binary, math.floor(number / math.pow(2, j)) % 2)
        end
        table.insert(binaries, table.concat(binary))
    end
    return table.concat(binaries)
end

function Day16.decode_packet(binary, index)
    local version = tonumber(binary:sub(index, index + 2), 2)
    local type_id = tonumber(binary:sub(index + 3, index + 5), 2)
    local literal = nil
    local sub_packets = {}
    local current = index + 6

    if type_id == 4 then
        local groups = {}
        local stop = false
        while not stop do
            if binary:sub(current, current) == "0" then
                stop = true
            end
            local group = binary:sub(current + 1, current + 4)
            table.insert(groups, group)
            current = current + 5
        end
        literal = tonumber(table.concat(groups), 2)
    else
        if binary:sub(current, current) == "0" then
            local length = tonumber(binary:sub(current + 1, current + 15), 2)
            current = current + 16
            local i = 1
            while current < index + length + 16 do
                local sub_packet = Day16.decode_packet(binary, current)
                table.insert(sub_packets, sub_packet)
                current = sub_packet.next
                i = i + 1
            end
        else
            local nb_packets = tonumber(binary:sub(current + 1, current + 11), 2)
            current = current + 12
            for i = 1, nb_packets do
                local sub_packet = Day16.decode_packet(binary, current)
                table.insert(sub_packets, sub_packet)
                current = sub_packet.next
            end
        end
    end

    return {
        version = version,
        type_id = type_id,
        literal = literal,
        sub_packets = sub_packets,
        next = current
    }
end

function Day16.sum_packet_versions(packet)
    local sum = packet.version
    for _, sub_packet in ipairs(packet.sub_packets) do
        sum = sum + Day16.sum_packet_versions(sub_packet)
    end
    return sum
end

function Day16.sum_version_numbers(line)
    local binary = Day16.hex_to_bin(line)
    local packet = Day16.decode_packet(binary, 1)
    return Day16.sum_packet_versions(packet)
end

function Day16.calculate_value(packet)
    if packet.type_id == 4 then
        return packet.literal
    end

    local sub_packet_values = {}
    for _, sub_packet in ipairs(packet.sub_packets) do
        table.insert(sub_packet_values, Day16.calculate_value(sub_packet))
    end

    if packet.type_id == 0 then
        local sum = 0
        for _, value in ipairs(sub_packet_values) do
            sum = sum + value
        end
        return sum
    elseif packet.type_id == 1 then
        local product = 1
        for _, value in ipairs(sub_packet_values) do
            product = product * value
        end
        return product
    elseif packet.type_id == 2 then
        local min = nil
        for _, value in ipairs(sub_packet_values) do
            if not min or value < min then
                min = value
            end
        end
        return min
    elseif packet.type_id == 3 then
        local max = nil
        for _, value in ipairs(sub_packet_values) do
            if not max or value > max then
                max = value
            end
        end
        return max
    elseif packet.type_id == 5 then
        return sub_packet_values[1] > sub_packet_values[2] and 1 or 0
    elseif packet.type_id == 6 then
        return sub_packet_values[1] < sub_packet_values[2] and 1 or 0
    elseif packet.type_id == 7 then
        return sub_packet_values[1] == sub_packet_values[2] and 1 or 0
    end

    error("Type ID unknown")
end

function Day16.decode_outermost_value(line)
    local binary = Day16.hex_to_bin(line)
    local packet = Day16.decode_packet(binary, 1)
    return Day16.calculate_value(packet)
end

return Day16
