local Vector = require("lib.vector")

local Day19 = {}

function Day19.parse_scanners(lines)
    local scanners = {}
    local current_scanner = {
        beacons = {}
    }
    for _, line in ipairs(lines) do
        if #line == 0 then
            table.insert(scanners, current_scanner)
            current_scanner = {
                beacons = {}
            }
        else
            for scanner_id in line:gmatch("--- scanner (%d) ---") do
                current_scanner.id = scanner_id
            end
            for x, y, z in line:gmatch("(-?%d+),(-?%d+),(-?%d+)") do
                table.insert(current_scanner.beacons, Vector:new{
                    x = x,
                    y = y,
                    z = z
                })
            end
        end
    end
    table.insert(scanners, current_scanner)

    return scanners
end

function Day19.check_overlap(beacons, previous_beacons)
    local previous_beacon_set = {}
    for _, previous_beacon in ipairs(previous_beacons) do
        previous_beacon_set[previous_beacon:hash()] = true
    end

    for i = 1, #previous_beacons - 12 do
        local previous_beacon = previous_beacons[i]
        for j = 1, #beacons - 12 do
            local ref_beacon = beacons[j]
            local shift = Vector:new{
                x = previous_beacon.x - ref_beacon.x,
                y = previous_beacon.y - ref_beacon.y,
                z = previous_beacon.z - ref_beacon.z
            }

            local count_matching_beacons = 0
            for _, beacon in ipairs(beacons) do
                beacon:add(shift)
                if previous_beacon_set[beacon:hash()] then
                    count_matching_beacons = count_matching_beacons + 1
                end
            end

            if count_matching_beacons >= 12 then
                return shift
            end

            for _, beacon in ipairs(beacons) do
                beacon:subtract(shift)
            end
        end
    end
    return nil, nil
end

function Day19.arrange_beacons(scanner, previous_scanner)
    local beacons = scanner.beacons

    for i = 1, 3 do
        for j = 1, 2 do
            for k = 1, 2 do
                for l = 1, 2 do
                    for m = 1, 2 do
                        local shift = Day19.check_overlap(beacons, previous_scanner.beacons)
                        if shift then
                            return shift
                        end

                        for _, beacon in ipairs(beacons) do
                            beacon:flip_z()
                        end
                    end

                    for _, beacon in ipairs(beacons) do
                        beacon:flip_y()
                    end
                end

                for _, beacon in ipairs(beacons) do
                    beacon:exchange_y_z()
                end
            end

            for _, beacon in ipairs(beacons) do
                beacon:flip_x()
            end
        end

        for _, beacon in ipairs(beacons) do
            beacon:rotate_coordinates()
        end
    end

    return nil
end

function Day19.count_beacons(lines)
    local scanners = Day19.parse_scanners(lines)

    local count_overlapping_scanner = 1
    local overlapping_scanners = {
        [1] = true
    }

    while count_overlapping_scanner < #scanners do
        for scanner_index = 2, #scanners do
            if not overlapping_scanners[scanner_index] then
                for previous_scanner_index = 1, #scanners do
                    if scanner_index ~= previous_scanner_index and overlapping_scanners[previous_scanner_index] then
                        if Day19.arrange_beacons(scanners[scanner_index], scanners[previous_scanner_index]) then
                            overlapping_scanners[scanner_index] = true
                            count_overlapping_scanner = count_overlapping_scanner + 1
                            break
                        end
                    end
                end
            end
        end
    end

    local beacons = {}
    for _, scanner in ipairs(scanners) do
        for _, beacon in ipairs(scanner.beacons) do
            beacons[beacon:hash()] = true
        end
    end

    local count_beacons = 0
    for _, _ in pairs(beacons) do
        count_beacons = count_beacons + 1
    end

    return count_beacons
end

function Day19.find_greatest_distance(lines)
    local scanners = Day19.parse_scanners(lines)

    local count_overlapping_scanner = 1
    local overlapping_scanners = {
        [1] = true
    }

    local shifts = {Vector:new{
        x = 0,
        y = 0,
        z = 0
    }}

    while count_overlapping_scanner < #scanners do
        for scanner_index = 2, #scanners do
            if not overlapping_scanners[scanner_index] then
                for previous_scanner_index = 1, #scanners do
                    if scanner_index ~= previous_scanner_index and overlapping_scanners[previous_scanner_index] then
                        local shift = Day19.arrange_beacons(scanners[scanner_index], scanners[previous_scanner_index])
                        if shift then
                            overlapping_scanners[scanner_index] = true
                            count_overlapping_scanner = count_overlapping_scanner + 1
                            shifts[scanner_index] = shift
                            break
                        end
                    end
                end
            end
        end
    end

    local max_distance = 0
    for i = 1, #scanners do
        for j = 1, #scanners do
            if i ~= j then
                local distance = shifts[i]:distance(shifts[j])
                if distance > max_distance then
                    max_distance = distance
                end
            end
        end
    end

    return max_distance
end

return Day19
