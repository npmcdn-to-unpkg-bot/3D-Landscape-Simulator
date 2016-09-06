# my rasterio test, python 2

import os
import csv
import rasterio
import numpy as np
import numpy_indexed as npi
from PIL import Image


def vegtype_texture(strata_path):
    """ Creates a greyscale image from a given strata GeoTiff """

    with rasterio.open(strata_path, 'r') as src:

        strata_data = src.read(1).astype('int32')
        shape = strata_data.shape
        strata_flat = strata_data.ravel()

        keys = np.unique(strata_flat)
        mapping = dict()

        # 0 should map to 0
        # -9999 should map to 0
        # otherwise, map key to value directly
        for key in keys:
            value = key
            if key == -9999:
                value = 0
            mapping[key] = value  # * 30 # debug, to check that things are actually there

        image_shape = (shape[1], shape[0])  # images are column major
        texture = Image.new('L', image_shape)

        image_data = npi.remap(strata_flat, list(mapping.keys()), list(mapping.values()))
        texture.putdata(image_data)
        return texture


def stateclass_colors_as_list(colormap_path):

    colors = list()

    with open(colormap_path, 'r') as f:

        colors_src = f.readlines()[2:]
        for line in colors_src:
            line = line.strip().split(',')
            color = {
                'value': "rgb(" + ",".join([line[1], line[2], line[3]]) + ")",
                'name': line[5]
            }

            colors.append(color)

    return colors


def stateclass_texture2(sc_path, colormap_path):

    with open(colormap_path, 'r', newline='') as f:

        reader = csv.DictReader(f)

        r_map = dict()
        g_map = dict()
        b_map = dict()

        fill = -9999
        zero = 0
        r_map[fill] = g_map[fill] = b_map[fill] = r_map[zero] = g_map[zero] = b_map[zero] = 0

        for row in reader:
            color = row['Color'].split(',')
            idx = int(row['ID'])
            r = int(color[0])
            g = int(color[1])
            b = int(color[2])
            r_map[idx] = r
            g_map[idx] = g
            b_map[idx] = b

    # open the stateclass geotiff and get as a linear array
    with rasterio.open(sc_path, 'r') as src:
        # cast the values to integers since they are uniquely identifiable
        sc_data = src.read(1).astype('int32')
        shape = sc_data.shape
        sc_flat = sc_data.ravel()
        # copy and remap the numpy arrays to the rgb values we want
        sc_copy = np.copy(sc_flat)
        r_array = npi.remap(sc_copy, list(r_map.keys()), list(r_map.values()))
        g_array = npi.remap(sc_copy, list(g_map.keys()), list(g_map.values()))
        b_array = npi.remap(sc_copy, list(b_map.keys()), list(b_map.values()))

        # get construct the image data based on the mapped values
        image_data = [(r_array[i], g_array[i], b_array[i]) for i in range(shape[0] * shape[1])]

        # build the png image
        image_shape = (shape[1], shape[0])  # images are column major
        texture = Image.new('RGB', image_shape)
        texture.putdata(image_data)
        return texture


def create_stateclass_texture(sc_tif, colormap):

    r_map = dict()
    g_map = dict()
    b_map = dict()

    fill = -9999
    zero = 0
    r_map[fill] = g_map[fill] = b_map[fill] = r_map[zero] = g_map[zero] = b_map[zero] = 0

    for row in colormap:
        idx = int(row['ID'])
        r_map[idx] = int(row['r'])
        g_map[idx] = int(row['g'])
        b_map[idx] = int(row['b'])

    # open the stateclass geotiff and get as a linear array
    with rasterio.open(sc_tif, 'r') as src:
        # cast the values to integers since they are uniquely identifiable
        sc_data = src.read(1).astype('int32')
        shape = sc_data.shape
        sc_flat = sc_data.ravel()
        # copy and remap the numpy arrays to the rgb values we want
        sc_copy = np.copy(sc_flat)
        r_array = npi.remap(sc_copy, list(r_map.keys()), list(r_map.values()))
        g_array = npi.remap(sc_copy, list(g_map.keys()), list(g_map.values()))
        b_array = npi.remap(sc_copy, list(b_map.keys()), list(b_map.values()))

        # get construct the image data based on the mapped values
        image_data = [(r_array[i], g_array[i], b_array[i]) for i in range(shape[0] * shape[1])]

        # build the png image
        image_shape = (shape[1], shape[0])  # images are column major
        texture = Image.new('RGB', image_shape)
        texture.putdata(image_data)
    return texture

def process_stateclass_directory(dir_path, sc_defs):
    """
    Process a directory of stateclass outputs.
    :param dir_path: Absolute path to the output directory for the given scenario.
    :param sc_defs: The stateclass definitions
    :return:
    """

    colormap = list()
    for stateclass in sc_defs.keys():
        color = sc_defs[stateclass]['Color'].split(',')
        r = color[1]
        g = color[2]
        b = color[3]
        idx = sc_defs[stateclass]['ID']
        colormap.append({'ID':idx, 'r': r, 'g': g, 'b': b})

    file_names = os.listdir(dir_path)
    print(sc_defs)
    for f_name in file_names:
        name_parts = f_name.split('-')

        # TODO - replace with regex, since that would be easier to parse
        if name_parts[-1][:2] == 'sc' and name_parts[-1].split(".")[-1] == 'tif':
            # parse iteration, timestep
            iteration = int(name_parts[0][2:])
            timestep = int(name_parts[1][2:])
            print(iteration)
            print(timestep)
            texture = create_stateclass_texture(os.path.join(dir_path, f_name), colormap)
            output_path = os.path.join(dir_path, 'stateclass_{timestep}.png'.format(timestep=timestep))
            texture.save(output_path)


def stateclass_texture(sc_path, colormap_path):
    """ Creates an RGB image from a given stateclass GeoTiff and a color config file"""

    with open(colormap_path, 'r') as f:
        # Get the colormap for the output
        colors_src = f.readlines()[2:]  # Skip headers

        r_map = dict()
        g_map = dict()
        b_map = dict()

        fill = -9999
        zero = 0
        r_map[fill] = g_map[fill] = b_map[fill] = r_map[zero] = g_map[zero] = b_map[zero] = 0

        for color_text in colors_src:
            color = color_text.strip().split(',')
            idx = int(color[0])
            r = int(color[1])
            g = int(color[2])
            b = int(color[3])
            r_map[idx] = r
            g_map[idx] = g
            b_map[idx] = b

        # open the stateclass geotiff and get as a linear array
    with rasterio.open(sc_path, 'r') as src:
        # cast the values to integers since they are uniquely identifiable
        sc_data = src.read(1).astype('int32')
        shape = sc_data.shape
        sc_flat = sc_data.ravel()
        # copy and remap the numpy arrays to the rgb values we want
        sc_copy = np.copy(sc_flat)
        r_array = npi.remap(sc_copy, list(r_map.keys()), list(r_map.values()))
        g_array = npi.remap(sc_copy, list(g_map.keys()), list(g_map.values()))
        b_array = npi.remap(sc_copy, list(b_map.keys()), list(b_map.values()))

        # get construct the image data based on the mapped values
        image_data = [(r_array[i], g_array[i], b_array[i]) for i in range(shape[0] * shape[1])]

        # build the png image
        image_shape = (shape[1], shape[0])  # images are column major
        texture = Image.new('RGB', image_shape)
        texture.putdata(image_data)
        return texture


if __name__ == "__main__":  # debug

    # input sc path, colormap path
    color_path = "C:\\Users\\taylo\\Desktop\\Sim19Oct2015\\State Class.csv"

    # actual output from our process
    input_path_init = "C:\\Users\\taylo\\Desktop\\Sim19Oct2015\\MasterSsim09June2014.ssim.input\\Scenario-8755\\STSim_InitialConditionsSpatial\\output.tif"
    
    # something initial that syncrosim outputs
    input_path_init_checker = "C:\\Users\\taylo\Desktop\\Sim19Oct2015\\MasterSsim09June2014.ssim.output\\Scenario-8755\\Spatial\\It0001-Ts0000-sc.tif"
    
    # syncrosim churning
    input_path1 = "C:\\Users\\taylo\Desktop\\Sim19Oct2015\\MasterSsim09June2014.ssim.output\\Scenario-8755\\Spatial\\It0001-Ts0001-sc.tif"
    input_path2 = "C:\\Users\\taylo\Desktop\\Sim19Oct2015\\MasterSsim09June2014.ssim.output\\Scenario-8755\\Spatial\\It0001-Ts0002-sc.tif"
    input_path3 = "C:\\Users\\taylo\Desktop\\Sim19Oct2015\\MasterSsim09June2014.ssim.output\\Scenario-8755\\Spatial\\It0001-Ts0003-sc.tif"
    input_path4 = "C:\\Users\\taylo\Desktop\\Sim19Oct2015\\MasterSsim09June2014.ssim.output\\Scenario-8755\\Spatial\\It0001-Ts0004-sc.tif"
    input_path5 = "C:\\Users\\taylo\Desktop\\Sim19Oct2015\\MasterSsim09June2014.ssim.output\\Scenario-8755\\Spatial\\It0001-Ts0005-sc.tif"
    
    # output images
    output_path_init = "C:\\Users\\taylo\\Desktop\\Sim19Oct2015\\stateclass_image_00.png"
    output_path_init_checker = "C:\\Users\\taylo\\Desktop\\Sim19Oct2015\\stateclass_image_01.png"
    output_path1 = "C:\\Users\\taylo\\Desktop\\Sim19Oct2015\\stateclass_image_02.png"
    output_path2 = "C:\\Users\\taylo\\Desktop\\Sim19Oct2015\\stateclass_image_03.png"
    output_path3 = "C:\\Users\\taylo\\Desktop\\Sim19Oct2015\\stateclass_image_04.png"
    output_path4 = "C:\\Users\\taylo\\Desktop\\Sim19Oct2015\\stateclass_image_05.png"
    output_path5 = "C:\\Users\\taylo\\Desktop\\Sim19Oct2015\\stateclass_image_06.png"

    #stateclass_texture2(color_path, input_path_init).save(output_path_init)
    stateclass_texture2(input_path_init,color_path).save(output_path_init)
    stateclass_texture2(input_path_init_checker,color_path).save(output_path_init_checker)
    stateclass_texture2(input_path1,color_path).save(output_path1)
    stateclass_texture2(input_path2,color_path).save(output_path2)
    stateclass_texture2(input_path3,color_path).save(output_path3)
    stateclass_texture2(input_path4,color_path).save(output_path4)
    stateclass_texture2(input_path5,color_path).save(output_path5)


