const path = require('path')
var notarize = require('electron-notarize')

module.exports = async function (params) {
  // Notarization only applies to macOS
  if (process.platform !== 'darwin') {
    return
  }


  try {
    console.log(`  • Notarizing`)
    await notarize.notarize({
     	appBundleId: 'net.weeek.app',
    	appPath: `${appOutDir}/${appName}.app`,
    	teamId: 'TDNCM3WEA2',
    	appleId: 'baron234@yandex.ru',
    	appleIdPassword: 'xeob-ymeo-gszc-krpr',
    })
  } catch (error) {
    console.error(error)
  }
}