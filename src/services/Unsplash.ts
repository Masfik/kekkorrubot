import { Axios } from "axios";

export default class Unsplash {
    private readonly axios = new Axios({
        baseURL: "https://api.unsplash.com",
        headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}`
        }
    });
    
    async fetchRandomPhotoURL() {
        if (process.env.DEVMODE)
            return "https://cdn.ebaumsworld.com/mediaFiles/picture/2452130/85386505.jpg";
        
        const { data } = await this.axios.get("/photos/random");
        return JSON.parse(data).urls.regular;
    }
}