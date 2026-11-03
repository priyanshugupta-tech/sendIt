/**
 * Jaise user / router par visit karega hm request bhejenge data access karne hetu par agar access token hua to access token warna refresh se pahle access token generate karenge aur fir us refresh token se access token generate karenge aur usse fir usse hm data acess karne ke liye request karenge*
 * ab issue ye hoskta hai ki hamare refresh token kaha se aaega to uski chita nahi wo ham apne global store se laaege
 * Chances kam hai par hoskta hai ki refresh token expired ho tab hame use handle karna padega
 * agar newToken generate hone me kuchh error aae to uss hisab se decide hoga ki user logged in hai ya nahi hai
 * then agar nahi hua to redirect to the auth route and waha se verify-otp wala route once signup successful...agr nahi hua to waha par v edge cases handle karne padenge
 * then login ka v dekhna padega...wo simple hai usme tereko data lena hai aur usko request ke saath api par bhejdena hai ek post request ke saath aur waha se jo response aaye us hisab se / route par le jana hai aur saath ke saath access token jo ki return me milega verify-otp aur login dono hi cases me unko sahi se handle v karna padega
 * store setup karna padega sabse pahle baad me baaki sab kuchh
 */
