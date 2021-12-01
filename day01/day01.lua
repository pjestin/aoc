local Day01 = {}

function Day01:count_depth_increases(lines, window_size)
    depth_increases = 0
    for i, depth_string in ipairs(lines) do
        local depth = tonumber(depth_string)
        local previous_depth = tonumber(lines[i - window_size])
        if i - window_size >= 0 then
            if previous_depth and depth > previous_depth then
                depth_increases = depth_increases + 1
            end
        end
    end
    return depth_increases
end

return Day01
