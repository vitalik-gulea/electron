import { app, BrowserWindow, shell, ipcMain } from 'electron';
import path from 'path';


function createWindow() {
	const mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			preload: path.join(app.getAppPath(), 'preload.js'),
		},
	});

	// if (!process.env.ELECTRON_URL) {
	// 	throw new Error('ELECTRON_URL should be provided in .env.');
	// }

	mainWindow.loadURL('https://app.weeek.net');

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('http:') || url.startsWith('https:')) {
			shell.openExternal(url);

			return { action: 'deny' };
		}

		return { action: 'allow' };
	});

	ipcMain.on('download-item', async (event, { downloadLink }) => {
		mainWindow.webContents.downloadURL(downloadLink);
	});

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		mainWindow.loadURL(url);
		return { action: 'deny' };
	});
	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.webContents
			.executeJavaScript(
				`
            const newDiv = document.createElement('div');
	newDiv.id = 'electronBackButton';
	newDiv.textContent = 'Back to Weeek';
	newDiv.style.position = 'fixed';
	newDiv.style.backgroundColor = '#6788f3';
	newDiv.style.padding = '12px';
    newDiv.style.top = '10px';
    newDiv.style.right = '10px';
	newDiv.style.borderRadius = '5px';
	newDiv.style.color = '#fff';
    newDiv.style.fontFamily = 'Arial';
    newDiv.style.cursor = 'pointer';
	newDiv.style.zIndex = 10000000000000000000;
	document.body.appendChild(newDiv);
	newDiv.addEventListener('click', () => {
		window.history.back();
	});
	const checkURL = () => {
		const currentURL = window.location.href;
		if (currentURL.includes('https://app.weeek.net')) {
			if (document.getElementById('electronBackButton')) {
				document.body.removeChild(newDiv);
			}
		}
        else {
			if (!document.getElementById('electronBackButton')) {
				document.body.appendChild(newDiv);
			}
		}
	};

	window.addEventListener('popstate', checkURL);
	window.addEventListener('pushstate', checkURL);
	window.addEventListener('replacestate', checkURL);

	checkURL();

        `,
			)
			.then((result) => {
				console.log('Div added');
			})
			.catch((error) => {
				console.log('Failed to add div:', error);
			});
	});
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!BrowserWindow.getAllWindows().length) {
		createWindow();
	}
});
