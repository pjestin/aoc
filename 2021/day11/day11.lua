local Day11 = {}

function Day11.parse_energy_levels(lines)
    local energy_levels = {}
    for _, line in ipairs(lines) do
        local energy_level_row = {}
        for i = 1, #line do
            table.insert(energy_level_row, tonumber(line:sub(i, i)))
        end
        table.insert(energy_levels, energy_level_row)
    end
    return energy_levels
end

function Day11.check_flash(row, col, energy_levels)
    if energy_levels[row][col] > 9 then
        energy_levels[row][col] = 0
        for _, neighbour in ipairs({{
            row = row - 1,
            col = col - 1
        }, {
            row = row - 1,
            col = col
        }, {
            row = row - 1,
            col = col + 1
        }, {
            row = row,
            col = col - 1
        }, {
            row = row,
            col = col + 1
        }, {
            row = row + 1,
            col = col - 1
        }, {
            row = row + 1,
            col = col
        }, {
            row = row + 1,
            col = col + 1
        }}) do
            if neighbour.row >= 1 and neighbour.row <= #energy_levels and neighbour.col >= 1 and neighbour.col <=
                #energy_levels[1] and energy_levels[neighbour.row][neighbour.col] > 0 then
                energy_levels[neighbour.row][neighbour.col] = energy_levels[neighbour.row][neighbour.col] + 1
                Day11.check_flash(neighbour.row, neighbour.col, energy_levels)
            end
        end
    end
end

function Day11.iterate_energy(energy_levels)
    for row = 1, #energy_levels do
        for col = 1, #energy_levels[1] do
            energy_levels[row][col] = energy_levels[row][col] + 1
        end
    end

    for row = 1, #energy_levels do
        for col = 1, #energy_levels[1] do
            Day11.check_flash(col, row, energy_levels)
        end
    end
end

function Day11.count_flashes(lines)
    local energy_levels = Day11.parse_energy_levels(lines)

    local count_flash = 0
    for step = 1, 100 do
        Day11.iterate_energy(energy_levels)

        for row = 1, #energy_levels do
            for col = 1, #energy_levels[1] do
                if energy_levels[col][row] == 0 then
                    count_flash = count_flash + 1
                end
            end
        end
    end

    return count_flash
end

function Day11.find_simultaneous_flash_step(lines)
    local energy_levels = Day11.parse_energy_levels(lines)

    for step = 1, 10000 do
        Day11.iterate_energy(energy_levels)

        local count_flash = 0
        for row = 1, #energy_levels do
            for col = 1, #energy_levels[1] do
                if energy_levels[col][row] == 0 then
                    count_flash = count_flash + 1
                end
            end
        end
        if count_flash == #energy_levels * #energy_levels[1] then
            return step
        end
    end

    error("No synchronisation step found")
end

return Day11
