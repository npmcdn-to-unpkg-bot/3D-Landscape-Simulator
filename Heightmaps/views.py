from __future__ import division

import os
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from netCDF4 import Dataset
import numpy as np
from PIL import Image
from django.conf import settings

path = os.path.join(settings.STATICFILES_DIRS[0], 'dems/WestUS_30AS.nc')

@csrf_exempt
def generate_heightmap(request, nlat=None, slat=None, elon=None, wlon=None):

    response = HttpResponse(content_type="image/png")

    if request.method == u'GET':
        if nlat is not None and slat is not None and elon is not None and wlon is not None:

            print nlat, slat, elon, wlon

            north_lat = float(nlat)
            south_lat = float(slat)
            east_lon = float(elon)
            west_lon = float(wlon)

            with Dataset(path, 'r') as ds:
                    # access our variables
                    lats = ds.variables['lat'][:]
                    lons = ds.variables['lon'][:]
                    if not verify_coords(lats, lons, north_lat, south_lat, east_lon, west_lon):
                        image = Image.new('L', (64,64))
                        image.save(response, "PNG")
                        print 'blah'
                    else:
                        elev = ds.variables['elev'][:].data
                        # collect indices
                        indices = get_indices(lats, lons, north_lat,south_lat, east_lon, west_lon)
                        #print(indices)
                        # shape up our dem slice
                        dem_slice = elev[indices['w']:indices['e'],indices['n']:indices['s']]
                        #//print(dem_slice.shape)
                        dem_flat = dem_slice.ravel().tolist()
                        dem_max = dem_slice.max()
                        print dem_max, ':dem max'
                        # scale the values to rgb values
                        dem_flat = [(x/dem_max) * 255 for x in dem_flat]

                        print dem_flat[10]
                        # write and save new image
                        image = Image.new('L', (dem_slice.shape[1], dem_slice.shape[0]))
                        image.putdata(dem_flat)
                        #image = image.rotate(90, expand=True)
                        #return {'image' : image, 'dem': dem_flat}
                        image.save(response, "PNG")
                        print 'made it'

    return response

def verify_coords(lats, lons, nlat, slat, elon, wlon):

       return not (nlat > lats[0] or nlat < lats[-1] or slat > lats[0] or slat < lats[-1] or elon < lons[0] or
                elon > lons[-1] or wlon < lons[0] or wlon > lons[-1])

def get_indices(lats, lons, nlat, slat, elon, wlon):

    lats1 = np.where(lats < nlat)
    lats2 = np.where(lats > slat)
    n_idx = lats1[0][0]
    s_idx = lats2[0][-1]
    lons1 = np.where(lons < elon)   # assumes elon,wlon are negative
    lons2 = np.where(lons > wlon)
    e_idx = lons1[0][-1]
    w_idx = lons2[0][0]
    result = {'n':n_idx, 's':s_idx,'w':w_idx,'e':e_idx}
    return result