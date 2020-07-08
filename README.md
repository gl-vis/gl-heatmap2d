gl-heatmap2d
============
2D heatmaps

Modified by: Louise Ord 
Date: 2020-07-08

This version of gl-heatmap2d modifies Mikola Lysenko's original code to optionally produce a discretised heatmap instead of an interpolated one. 

This is achieved by introducing an option, zsmooth, that defaults to the smoothed heatmap.

If the option zsmooth: false is passed to createHeatmap2D, the discretised heatmap will be rendered. 

Scientific data is often discretised and this option allows the data to be represented as measured rather than smoothing between observations.

# License
(c) 2015 Mikola Lysenko. MIT License
