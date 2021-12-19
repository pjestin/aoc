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
    for _, previous_beacon in ipairs(previous_beacons) do
        for _, ref_beacon in ipairs(beacons) do
            local shift = Vector:new{
                x = previous_beacon.x - ref_beacon.x,
                y = previous_beacon.y - ref_beacon.y,
                z = previous_beacon.z - ref_beacon.z
            }
            -- print("first_beacon:", first_beacon:to_string())
            -- print("previous_beacon:", previous_beacon:to_string())
            -- print("shift:", shift:to_string())
            -- error("haha")
            local beacons_from_both = {}
            for _, previous_beacon in ipairs(previous_beacons) do
                beacons_from_both[previous_beacon:to_string()] = true
            end
            for _, beacon in ipairs(beacons) do
                beacon:add(shift)
                -- print("shifted_beacon:", shifted_beacon:to_string())
                beacons_from_both[beacon:to_string()] = true
            end

            local count_from_both = 0
            for _, _ in pairs(beacons_from_both) do
                count_from_both = count_from_both + 1
            end

            -- print(count_from_both, #beacons, count_previous_beacons)
            if count_from_both <= #beacons + #previous_beacons - 12 then
                return beacons, true
            end

            shift:reverse()
            for _, beacon in ipairs(beacons) do
                beacon:add(shift)
            end
            -- error("haha")
        end
    end
    return nil, false
end

function Day19.arrange_beacons(scanner, previous_scanner)
    local beacons = scanner.beacons

    for i = 1, 3 do
        for j = 1, 2 do
            for k = 1, 2 do
                for l = 1, 2 do
                    for m = 1, 2 do
                        local arranged_beacons, is_overlap = Day19.check_overlap(beacons, previous_scanner.beacons)
                        if is_overlap then
                            print("Overlap found")
                            scanner.beacons = arranged_beacons
                            return true
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

    print("No overlap found!")
    return false
end

function Day19.count_beacons(lines)
    local scanners = Day19.parse_scanners(lines)

    local count_overlapping_scanner = 1
    local overlapping_scanners = {
        [1] = true
    }

    while count_overlapping_scanner < #scanners do
        print("count_overlapping_scanner:", count_overlapping_scanner)
        for scanner_index = 2, #scanners do
            if not overlapping_scanners[scanner_index] then
                print("scanner:", scanner_index)
                for previous_scanner_index = 1, #scanners do
                    if scanner_index ~= previous_scanner_index and overlapping_scanners[previous_scanner_index] then
                        print("previous scanner:", previous_scanner_index)
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
            beacons[beacon:to_string()] = true
        end
    end

    local count_beacons = 0
    for _, _ in pairs(beacons) do
        count_beacons = count_beacons + 1
    end

    return count_beacons
end

return Day19
