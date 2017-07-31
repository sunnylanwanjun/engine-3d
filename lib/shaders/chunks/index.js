export default {
  'phong_lighting.frag': 'struct LightInfo {\n  vec3 diffuse;\n  vec3 specular;\n};\nLightInfo computeDirecionalLighting(vec3 lightDirection, vec3 lightColor, vec3 normal, vec3 viewDirection, float glossiness)\n{\n  LightInfo lightingResult;\n  float ndl = 0.0;\n  float ndh = 0.0;\n  vec3 lightDir = -normalize(lightDirection);\n  ndl = max(0.0, dot(normal, lightDir));\n  vec3 dirH = normalize(viewDirection + lightDir);\n  ndh = max(0.0, dot(normal, dirH));\n  ndh = (ndl == 0.0) ? 0.0: ndh;\n  ndh = pow(ndh, max(1.0, glossiness));\n  lightingResult.diffuse = lightColor * ndl;\n  lightingResult.specular = lightColor * ndh;\n  return lightingResult;\n}\nLightInfo computePointLighting(vec3 lightPosition, vec3 lightColor, float lightRange, vec3 normal, vec3 positionW, vec3 viewDirection, float glossiness)\n{\n  LightInfo lightingResult;\n  float ndl = 0.0;\n  float ndh = 0.0;\n  vec3 lightDir = vec3(0, 0, 0);\n  float attenuation = 1.0;\n  lightDir = lightPosition - positionW;\n  attenuation = max(0., 1.0 - length(lightDir) / lightRange);\n  lightDir = normalize(lightDir);\n  ndl = max(0.0, dot(normal, lightDir));\n  vec3 dirH = normalize(viewDirection + lightDir);\n  ndh = max(0.0, dot(normal, dirH));\n  ndh = (ndl == 0.0) ? 0.0: ndh;\n  ndh = pow(ndh, max(1.0, glossiness));\n  lightingResult.diffuse = lightColor * ndl * attenuation;\n  lightingResult.specular = lightColor * ndh * attenuation;\n  return lightingResult;\n}\nLightInfo computeSpotLighting(vec3 lightPosition, vec3 lightDirection, vec3 lightColor, float lightRange, vec2 lightSpot,\n                              vec3 normal, vec3 positionW, vec3 viewDirection, float glossiness)\n{\n  LightInfo lightingResult;\n  float ndl = 0.0;\n  float ndh = 0.0;\n  vec3 lightDir = vec3(0, 0, 0);\n  float attenuation = 1.0;\n  float cosConeAngle = 1.0;\n  lightDir = lightPosition - positionW;\n  attenuation = max(0., 1.0 - length(lightDir) / lightRange);\n  lightDir = normalize(lightDir);\n  cosConeAngle = max(0., dot(lightDirection, -lightDir));\n  cosConeAngle = cosConeAngle < lightSpot.x ? 0.0 : cosConeAngle;\n  cosConeAngle = pow(cosConeAngle,lightSpot.y);\n  ndl = max(0.0, dot(normal, lightDir));\n  vec3 dirH = normalize(viewDirection + lightDir);\n  ndh = max(0.0, dot(normal, dirH));\n  ndh = (ndl == 0.0) ? 0.0: ndh;\n  ndh = pow(ndh, max(1.0, glossiness));\n  lightingResult.diffuse = lightColor * ndl * attenuation * cosConeAngle;\n  lightingResult.specular = lightColor * ndh * attenuation * cosConeAngle;\n  return lightingResult;\n}\n{{#directionalLightSlots}}\n  uniform vec3 dir_light{{id}}_direction;\n  uniform vec3 dir_light{{id}}_color;\n{{/directionalLightSlots}}\n{{#pointLightSlots}}\n  uniform vec3 point_light{{id}}_position;\n  uniform vec3 point_light{{id}}_color;\n  uniform float point_light{{id}}_range;\n{{/pointLightSlots}}\n{{#spotLightSlots}}\n  uniform vec3 spot_light{{id}}_position;\n  uniform vec3 spot_light{{id}}_direction;\n  uniform vec3 spot_light{{id}}_color;\n  uniform float spot_light{{id}}_range;\n  uniform vec2 spot_light{{id}}_spot;\n{{/spotLightSlots}}\nLightInfo getPhongLighting(vec3 normal, vec3 positionW, vec3 viewDirection, float glossiness) {\n  LightInfo result;\n  result.diffuse = vec3(0, 0, 0);\n  result.specular = vec3(0, 0, 0);\n  LightInfo dirLighting;\n  {{#directionalLightSlots}}\n    dirLighting = computeDirecionalLighting(dir_light{{id}}_direction,dir_light{{id}}_color,normal, viewDirection, glossiness);\n    result.diffuse += dirLighting.diffuse;\n    result.specular += dirLighting.specular;\n  {{/directionalLightSlots}}\n  LightInfo pointLighting;\n  {{#pointLightSlots}}\n    pointLighting = computePointLighting(point_light{{id}}_position, point_light{{id}}_color, point_light{{id}}_range, \n                                         normal, positionW, viewDirection, glossiness);\n    result.diffuse += pointLighting.diffuse;\n    result.specular += pointLighting.specular;\n  {{/pointLightSlots}}\n  LightInfo spotLighting;\n  {{#spotLightSlots}}\n    spotLighting = computeSpotLighting(spot_light{{id}}_position, spot_light{{id}}_direction, spot_light{{id}}_color, \n                    spot_light{{id}}_range, spot_light{{id}}_spot,normal, positionW, viewDirection, glossiness);\n    result.diffuse += spotLighting.diffuse;\n    result.specular += spotLighting.specular;\n  {{/spotLightSlots}}\n  return result;\n}\n',
};