import { ImageBackground } from "react-native"
import { IMAGES } from "@/assets"
import { TextView, Image } from "@/components"

export const Splash = () => {
    return(
        <ImageBackground source={IMAGES.auth.splash} style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
           <Image source={IMAGES.auth.splashLogo} />
        </ImageBackground>
    )
}