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
    try {
        const load = cheerio.load(html);
        let lines = 0;
    
        const titleMatch = html.match(/Title: (.+)/);
        let title = titleMatch ? titleMatch[1] : load('body p').first().text().trim();
    
        if (!title.trim()) {
          title = load('body p').eq(1).text().trim();
          lines = 1;
        }
    
        let authorLine = load('body p').eq(2 + lines).text().trim();
        let authors = [];
        
        if (authorLine.trim().toLowerCase().startsWith("by") || authorLine.trim().toLowerCase().startsWith("by:")) {
          const authorMatch = authorLine.match(/By:?\s*([^<]+)/i);
          if (authorMatch) {
            authors = authorMatch[1].split(/\s*(?:,\s*| and )\s*/i).map(author => author.trim());;
          } else {
            authors.push('Author not found');
          }
        } else {
          authors.push(authorLine);
        }
    
        let categoryIssueLine = load('body p').eq(1 + lines).text().trim();
        let category = 'Category not found';
        let issue = 'Issue not found';
    
        const categoryIssueParts = categoryIssueLine.split('/');
        for (const part of categoryIssueParts) {
          if (part.trim().toLowerCase().includes('issue')) {
            issue = part.replace(/\D/g, "");
          } else if (!part.trim().toLowerCase().includes('the spectator')){
            category = part.trim();
          } 
        }
    
        const focusSentenceRegex = /Focus Sentence:\s*(.*)/i;
        const focusSentenceElement = load('body p').filter(function() { return focusSentenceRegex.test(load(this).text()); }).first();
        const focusSentence = focusSentenceElement.text().replace(/Focus Sentence:/gi, '').trim()
    
        const head = load('head').html();
        const content = `<head>${head}</head><body>${load('body p').eq(focusSentenceElement.index()).nextUntil('body').toString()}</body>`;
    
        return {
            title,
            category,
            issue,
            authors,
            focusSentence,
            content
        };
    
      }catch (error) {
        console.error('Error reading the file:', error);
        throw error;
      }
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