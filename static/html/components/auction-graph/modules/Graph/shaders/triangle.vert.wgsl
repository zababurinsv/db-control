struct vertexOut {
    @builtin(position) outPosition: vec4<f32>;
    @location(0) outColor: vec3<f32>;
};

@stage(vertex)
fn main(@location(0) inPosition: vec3<f32>, @location(1) inColor: vec3<f32>) -> vertexOut {
    var vertex: vertexOut;
    vertex.outPosition = vec4<f32>(inPosition, 1.0);
    vertex.outColor = inColor;
    return vertex;
}
