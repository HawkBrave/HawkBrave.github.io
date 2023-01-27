precision highp float;

// complex number operations
#define cx_add(a, b) vec2(a.x + b.x, a.y + b.y)
#define cx_sub(a, b) vec2(a.x - b.x, a.y - b.y)
#define cx_mul(a, b) vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x)
#define cx_div(a, b) vec2(((a.x*b.x + a.y*b.y)/(b.x*b.x + b.y*b.y)), ((a.y*b.x - a.x*b.y)/(b.x*b.x + b.y*b.y)))


vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// simgoid with range
float sigmoid(float x, float startX, float endX) {
    if (x <= startX) return 0.0;
    else if (x >= endX) return 1.0;
    else {
        float scaledX = (x - startX) / (endX - startX);
        return 0.5 + scaledX * (1.0 - abs(scaledX) * 0.5);
    }
}

// rng
float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}
