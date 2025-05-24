import{ createThirdwebClient} from 'thirdweb';


const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

if (!CLIENT_ID) {
    console.error("Missing NEXT_PUBLIC_CLIENT_ID in .env.local");}
console.log("Thirdweb Client ID:", CLIENT_ID);

export const client = createThirdwebClient({
    clientId:"67e4a05882cd598f5da5f88769b091db",
    

});


