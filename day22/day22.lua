local Vector = require("lib.vector")

local Day22 = {}

local Region = {}

function Region:new(o)
    o = o or {}
    setmetatable(o, self)
    self.__index = self
    return o
end

function Region:contains(cube)
    return cube.x >= self.min.x and cube.x < self.max.x and cube.y >= self.min.y and cube.y < self.max.y and cube.z >= self.min.z and cube.z < self.max.z
end

function Region:includes(o)
    return self.min.x <= o.min.x and self.max.x >= o.max.x and self.min.y <= o.min.y and self.max.y >= o.max.y and self.min.z <= o.min.z and self.max.z >= o.max.z
end

function Region:eq(o)
    return self.min.x == o.min.x and self.max.x == o.max.x and self.min.y == o.min.y and self.max.y == o.max.y and self.min.z == o.min.z and self.max.z == o.max.z
end

function Region:overlaps(o)
    return math.max(self.min.x, o.min.x) < math.min(self.max.x, o.max.x) and math.max(self.min.y, o.min.y) < math.min(self.max.y, o.max.y) and math.max(self.min.z, o.min.z) < math.min(self.max.z, o.max.z)
end

function Region:intersect(o)
    local intersection = Region:new{
        min = Vector:new{
            x = math.max(self.min.x, o.min.x),
            y = math.max(self.min.y, o.min.y),
            z = math.max(self.min.z, o.min.z)
        },
        max = Vector:new{
            x = math.min(self.max.x, o.max.x),
            y = math.min(self.max.y, o.max.y),
            z = math.min(self.max.z, o.max.z)
        }
    }
    return intersection
end

function Region:size()
    return (self.max.x - self.min.x) * (self.max.y - self.min.y) * (self.max.z - self.min.z)
end

function Region:valid()
    return self.min.x < self.max.x and self.min.y < self.max.y and self.min.z < self.max.z
end

function Day22.parse_reboot_steps(lines)
    local reboot_steps = {}

    for _, line in ipairs(lines) do
        for state, min_x, max_x, min_y, max_y, min_z, max_z in line:gmatch("(%w+) x=(-?%d+)..(-?%d+),y=(-?%d+)..(-?%d+),z=(-?%d+)..(-?%d+)") do
            local reboot_step = Region:new{
                state = state == "on",
                min = Vector:new{
                    x = tonumber(min_x),
                    y = tonumber(min_y),
                    z = tonumber(min_z)
                },
                max = Vector:new{
                    x = tonumber(max_x) + 1,
                    y = tonumber(max_y) + 1,
                    z = tonumber(max_z) + 1
                }
            }
            table.insert(reboot_steps, reboot_step)
        end
    end

    return reboot_steps
end

function Day22.count_initialization_region_cubes(lines)
    local reboot_steps = Day22.parse_reboot_steps(lines)
    local initialization_region = Region:new{
        min = Vector:new{x = -50, y = -50, z = -50},
        max = Vector:new{x = 51, y = 51, z = 51}
    }

    local initialization_steps = {}
    for _, reboot_step in ipairs(reboot_steps) do
        if initialization_region:includes(reboot_step) then
            table.insert(initialization_steps, reboot_step)
        end
    end

    local count_cubes_on = 0
    for x = initialization_region.min.x, initialization_region.max.x - 1 do
        for y = initialization_region.min.y, initialization_region.max.y - 1 do
            for z = initialization_region.min.z, initialization_region.max.z - 1 do
                local cube = Vector:new{x = x, y = y, z = z}
                local state = false
                for _, initialization_step in ipairs(initialization_steps) do
                    if initialization_step:contains(cube) then
                        state = initialization_step.state
                    end
                end
                if state then
                    count_cubes_on = count_cubes_on + 1
                end
            end
        end
    end

    return count_cubes_on
end

function Day22.split_region_with_intersection(region, intersection)
    local split_regions = {}
    local x_ranges = {{region.min.x, intersection.min.x}, {intersection.min.x, intersection.max.x}, { intersection.max.x, region.max.x}}
    local y_ranges = {{region.min.y, intersection.min.y}, {intersection.min.y, intersection.max.y}, { intersection.max.y, region.max.y}}
    local z_ranges = {{region.min.z, intersection.min.z}, {intersection.min.z, intersection.max.z}, { intersection.max.z, region.max.z}}
    for _, x_range in ipairs(x_ranges) do
        if x_range[1] < x_range[2] then
            for _, y_range in ipairs(y_ranges) do
                if y_range[1] < y_range[2] then
                    for _, z_range in ipairs(z_ranges) do
                        if z_range[1] < z_range[2] then
                            local split_region = Region:new{
                                min = Vector:new{
                                    x = x_range[1],
                                    y = y_range[1],
                                    z = z_range[1]
                                },
                                max = Vector:new{
                                    x = x_range[2],
                                    y = y_range[2],
                                    z = z_range[2]
                                }
                            }
                            if split_region:valid() and not split_region:eq(intersection) then
                                table.insert(split_regions, split_region)
                            end
                        end
                    end
                end
            end
        end
    end
    return split_regions
end

function Day22.split_regions(existing, new)
    if not existing:overlaps(new) then
        return nil, nil
    end
    local existing_split_regions = {}
    local new_split_regions = {}
    local intersection = existing:intersect(new)
    local split_regions_new = Day22.split_region_with_intersection(new, intersection)
    for _, split_region_new in ipairs(split_regions_new) do
        table.insert(new_split_regions, Region:new{min = split_region_new.min, max = split_region_new.max, state = new.state})
    end
    if new.state then
        table.insert(existing_split_regions, intersection)
    end
    local split_regions_existing = Day22.split_region_with_intersection(existing, intersection)
    for _, split_region_existing in ipairs(split_regions_existing) do
        table.insert(existing_split_regions, split_region_existing)
    end
    return existing_split_regions, new_split_regions
end

function Day22.count_reboot_cubes(lines)
    local reboot_steps = Day22.parse_reboot_steps(lines)

    local split_regions = {}

    for i, reboot_step in ipairs(reboot_steps) do
        if #split_regions == 0 and reboot_step.state then
            table.insert(split_regions, reboot_step)
        else
            local next_existing_split_regions = {}
            local new_split_regions = {}
            for j, split_region in ipairs(split_regions) do
                local this_existing_split_regions, this_new_split_regions = Day22.split_regions(split_region, reboot_step)
                if this_existing_split_regions then
                    for _, existing_split_region in ipairs(this_existing_split_regions) do
                        table.insert(next_existing_split_regions, existing_split_region)
                    end
                    for _, new_split_region in ipairs(this_new_split_regions) do
                        table.insert(new_split_regions, new_split_region)
                    end
                else
                    table.insert(next_existing_split_regions, split_region)
                end
            end
            if reboot_step.state then
                if #new_split_regions == 0 then
                    table.insert(next_existing_split_regions, reboot_step)
                end
                for _, new_split_region in ipairs(new_split_regions) do
                    table.insert(next_existing_split_regions, new_split_region)
                end
            end
            split_regions = next_existing_split_regions
        end
    end

    local count_cubes_on = 0
    for _, split_region in ipairs(split_regions) do
        count_cubes_on = count_cubes_on + split_region:size()
    end

    return count_cubes_on
end

return Day22
