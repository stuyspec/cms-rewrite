// Based on https://github.com/googleworkspace/browser-samples/blob/main/drive/picker/helloworld.html under Apache 2.0 License
import * as cheerio from 'cheerio';
import {SetStateAction, useEffect, useState} from "react";
import store from "../../store";
import {setError} from "../../reducers/error";

type PickerProps = {
    setContent: Function
}
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
const CLIENT_ID = '159949784673-ga53c408ptcjo3s71sd97ppqghgpp0aj.apps.googleusercontent.com';
const API_KEY = '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';  // "CLIENT_SECRET" is not actually secret
const APP_ID = 'file-picker-test-406301';

function parseHtml(html: string) {
    const load = cheerio.load(html);

    const title = load('p:contains("Title: ")').text().replace('Title: ', '');
    const categoryandissue = load('p:contains("The Spectator / ")').text().split('The Spectator / ')[1].split(" / Issue ");
    const [category, issue] = categoryandissue;
    const author = load('p:contains("By: ")').text().replace('By: ', '');
    const focusSentence = load('p:contains("Focus Sentence: ")').text().replace('Focus Sentence: ', '');
    const content = load('p:contains("Focus Sentence: ")').nextUntil('body').toString();
    return {
        title,
        category,
        issue,
        author,
        focusSentence,
        content
    };
}

export default function GoogleDocPicker(props: PickerProps) {
    const [gapiReady, setGapiReady] = useState<boolean>(false);
    const [tokenClient, setTokenClient] = useState();

    const [accessToken, setAccessToken] = useState<string>("");

    useEffect(() => {
        const gsiScript = document.createElement("script");
        gsiScript.src = "https://accounts.google.com/gsi/client"
        gsiScript.onload = () => {
            const tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: '', // defined later
            });
            tokenClient.callback = async (res: { error: undefined; access_token: SetStateAction<string>; }) => {
                if (res.error !== undefined) throw res;
                setAccessToken(res.access_token);

                await spawnPicker(res.access_token);
            }
            setTokenClient(tokenClient);
        }
        document.body.appendChild(gsiScript)
    }, [])
    useEffect(() => {
        const gapiScript = document.createElement("script");
        gapiScript.src = 'https://apis.google.com/js/api.js'
        gapiScript.onload = () => {
            gapi.load('client:picker', async () => {
                await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest')
            });
            setGapiReady(true);
        }
        document.body.appendChild(gapiScript)
    }, []);

    function handleGoogleClick() {
        if (tokenClient !== undefined) {
            tokenClient.requestAccessToken({
                // hd: "*",
                prompt: accessToken ? '' : 'consent'
            })
        }
    }
    async function spawnPicker(accessToken: string) {
        const view = new google.picker.DocsView(google.picker.ViewId.DOCUMENTS);
        view.setMode(google.picker.DocsViewMode.LIST);
        console.log("BUILDING WITH", accessToken)
        const picker = new google.picker.PickerBuilder()
            .setAppId(APP_ID)
            .setOAuthToken(accessToken)
            .addView(view)
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
    }

    async function pickerCallback(data: { action: any; }) {
        if (data.action !== google.picker.Action.PICKED) return;
        try {
            const result = await gapi.client.drive.files.export({fileId: data[google.picker.Response.DOCUMENTS][0][google.picker.Document.ID], mimeType: 'text/html'});
            const article = parseHtml(result.body)
            console.log(article);
            props.setContent(article);
        }
        catch (e) {
            store.dispatch(setError(e?.message + "\nDid you log in and choose a well-formatted draft?"));
        }
    }

    return (
        <div>
            <button id="google-button" onClick={handleGoogleClick} disabled={!(gapiReady && tokenClient)}>Pick from Google Drive</button>
        </div>
    )
}