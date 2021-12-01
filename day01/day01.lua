local Day01 = {}

function Day01:count_depth_increases(lines)
    previous_depth = nil
    depth_increases = 0
    for i, depth_string in ipairs(lines) do
        local depth = tonumber(depth_string)
        if previous_depth and depth > previous_depth then
            depth_increases = depth_increases + 1
        end
        previous_depth = depth
    end
    return depth_increases
end

return Day01
