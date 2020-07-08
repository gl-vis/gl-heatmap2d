gl-heatmap2d
============
2D heatmaps

Modified by: Louise Ord 
Date: 2020-07-08

This version of gl-heatmap2d modifies Mikola Lysenko's original code to produced a discretised heatmap instead of an interpolated one. This is achieved by introducing an is.smooth variable that defaults to the smoothed heatmap:

var isSmooth = options.zsmooth !== false

If the option zsmooth = false is passed to the createHeatmap2D function, the discretised heatmap will be rendered. Scientific data is often discretised and this option allows the data to be represented as measured rather than smoothing between observations.

# License
(c) 2015 Mikola Lysenko. MIT License
