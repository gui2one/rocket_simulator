export default class PartLoader {
  constructor() {}

  async load(json_url: string) {
    let response = await fetch(json_url);
    let json = await response.json();

    let clean_data = json;
    let split = json_url.split("/");
    // change extension

    let file_name = "";
    for (let i = 0; i < split.length - 1; i++) {
      file_name += split[i];
      file_name += "/";
    }
    file_name += split[split.length - 1].split(".")[0] + ".glb";
    clean_data.gltf = file_name;
    return Promise.resolve(json);
  }
}
