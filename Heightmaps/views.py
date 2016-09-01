from __future__ import division

import os
from django.http import HttpResponse, JsonResponse
from netCDF4 import Dataset
import numpy as np
from PIL import Image
from django.conf import settings
from django.views.generic import View

nonspatial_path = os.path.join(settings.STATICFILES_DIRS[1], 'WestUS_30AS.nc')
castle_creek_path = os.path.join(settings.STATICFILES_DIRS[1], 'castle_creek_dem_30m.nc')

DEM_HEIGHT = 5000.0


# TODO - generalize this for any spatial view. This currently only works for castle_creek_dem_30m.
class SpatialHeightmap(View):

    def get(self, request, *args, **kwargs):

        response = HttpResponse(content_type="image/png")
        with Dataset(castle_creek_path, 'r') as ds:
            width = ds.variables['x'][:].size
            height = ds.variables['y'][:].size
            elev = ds.variables['ned30m42116_snap_clip'][:]
            max = np.max(elev)
            dem_flat = [(x/max) * 255 for x in elev.ravel().tolist()]
            # write and save new image
            image = Image.new('L', (width, height))
            image.putdata(dem_flat)
            image.save(response, "PNG")

        return response

class SpatialStats(View):

    def get(self, request, *args, **kwargs):

        response = {}
        with Dataset(castle_creek_path, 'r') as ds:
            # access our variables
            xs = ds.variables['x'][:]
            ys = ds.variables['y'][:]
            elev = ds.variables['ned30m42116_snap_clip'][:]
            # shape up our dem slice
            dem_max = float(elev.max())
            dem_min = float(elev.min())
            dem_width = int(elev.shape[1])
            dem_height = int(elev.shape[0])

            data = {'dem_min': dem_min, 'dem_max': dem_max,
                    'dem_width': dem_width, 'dem_height': dem_height}

            response['data'] = data
        return JsonResponse(response)


class NonspatialHeightBase(View):

    def __init__(self):
        self.north_lat = None
        self.south_lat = None
        self.east_lon = None
        self.west_lon = None
        self.lats = None
        self.lons = None
        super().__init__()

    def dispatch(self, request, *args, **kwargs):

        self.north_lat = float(kwargs['nlat'])
        self.south_lat = float(kwargs['slat'])
        self.east_lon = float(kwargs['elon'])
        self.west_lon = float(kwargs['wlon'])
        return super(NonspatialHeightBase, self).dispatch(request, *args, **kwargs)

    def verify_indices(self):
        return not (self.north_lat > self.lats[0] or self.north_lat < self.lats[-1] or self.south_lat > self.lats[0] or
                    self.south_lat < self.lats[-1] or self.east_lon < self.lons[0] or
                    self.east_lon > self.lons[-1] or self.west_lon < self.lons[0] or self.west_lon > self.lons[-1])

    def retrieve_indices(self):

        lats1 = np.where(self.lats < self.north_lat)
        lats2 = np.where(self.lats > self.south_lat)
        n_idx = lats1[0][0]
        s_idx = lats2[0][-1]
        lons1 = np.where(self.lons < self.east_lon)   # assumes elon,wlon are negative
        lons2 = np.where(self.lons > self.west_lon)
        e_idx = lons1[0][-1]
        w_idx = lons2[0][0]
        result = {'n':n_idx, 's':s_idx,'w':w_idx,'e':e_idx}
        return result


class Stats(NonspatialHeightBase):

    def get(self, request, *args, **kwargs):
        response = {}
        if all([coord is not None for coord in [self.north_lat, self.south_lat, self.west_lon, self.east_lon]]):
            with Dataset(nonspatial_path, 'r') as ds:
                # access our variables
                self.lats = ds.variables['lat'][:]
                self.lons = ds.variables['lon'][:]
                if not self.verify_indices():
                    response['data'] = False
                else:
                    elev = ds.variables['elev'][:].data
                    # collect indices
                    indices = self.retrieve_indices()
                    # shape up our dem slice
                    dem_slice = elev[indices['w']:indices['e'],indices['n']:indices['s']]
                    dem_max = float(dem_slice.max())
                    dem_min = float(dem_slice.min())
                    dem_width = int(dem_slice.shape[1])
                    dem_height = int(dem_slice.shape[0])

                    #data = {'dem_min': dem_min, 'dem_max': dem_max,
                    #        'dem_width': dem_width, 'dem_height': dem_height}
                    data = {'dem_min': dem_min, 'dem_max': DEM_HEIGHT,
                            'dem_width': dem_width, 'dem_height': dem_height}

                    response['data'] = data

        return JsonResponse(response)


class Heightmap(NonspatialHeightBase):

    def get(self, request, *args, **kwargs):

        response = HttpResponse(content_type="image/png")

        if all([coord is not None for coord in [self.north_lat, self.south_lat, self.west_lon, self.east_lon]]):
            with Dataset(nonspatial_path, 'r') as ds:
                # access our variables
                self.lats = ds.variables['lat'][:]
                self.lons = ds.variables['lon'][:]
                if not self.verify_indices():
                    image = Image.new('L', (64,64))
                    image.save(response, "PNG")
                else:
                    elev = ds.variables['elev'][:].data
                    # collect indices
                    indices = self.retrieve_indices()
                    # print(indices)
                    # shape up our dem slice
                    dem_slice = elev[indices['w']:indices['e'],indices['n']:indices['s']]
                    # print(dem_slice.shape)
                    dem_flat = dem_slice.ravel().tolist()
                    dem_max = dem_slice.max()
                    # dem_flat = [(x/dem_max) * 255 for x in dem_flat]
                    dem_flat = [(x/DEM_HEIGHT) * 255 for x in dem_flat]

                    # write and save new image
                    image = Image.new('L', (dem_slice.shape[1], dem_slice.shape[0]))
                    image.putdata(dem_flat)
                    #image = image.rotate(90, expand=True)
                    #return {'image' : image, 'dem': dem_flat}
                    image.save(response, "PNG")

        return response
