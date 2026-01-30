// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use once_cell::sync::Lazy;
use std::sync::{mpsc, Mutex};
use std::thread;

enum RpcMsg {
    Connect { client_id: String },
    SetActivity { state: String, details: String },
    Clear,
}

static RPC_TX: Lazy<Mutex<Option<mpsc::Sender<RpcMsg>>>> = Lazy::new(|| Mutex::new(None));

fn start_rpc_worker() -> mpsc::Sender<RpcMsg> {
    let (tx, rx) = mpsc::channel::<RpcMsg>();

    thread::spawn(move || {
        let mut client: Option<DiscordIpcClient> = None;

        while let Ok(msg) = rx.recv() {
            match msg {
                RpcMsg::Connect { client_id } => {
                    // Wenn schon verbunden: ignorieren
                    if client.is_some() {
                        println!("[RPC] already connected");
                        continue;
                    }

                    println!("[RPC] connecting...");
                    match DiscordIpcClient::new(&client_id) {
                        Ok(mut c) => match c.connect() {
                            Ok(_) => {
                                println!("[RPC] connected");
                                client = Some(c);
                            }
                            Err(e) => {
                                println!("[RPC] connect error: {e}");
                                client = None;
                            }
                        },
                        Err(e) => {
                            println!("[RPC] client create error: {e}");
                            client = None;
                        }
                    }
                }

                RpcMsg::SetActivity { state, details } => {
                    if let Some(c) = client.as_mut() {
                        let act = activity::Activity::new()
                            .state(&state)
                            .details(&details)
                            .assets(
                                activity::Assets::new()
                                    .large_image("nuvion_client_icon")
                                    .large_text("Nuvion Client"),
                            )
                            .buttons(vec![
                                activity::Button::new("Website", "https://nuvionclient.com/"),
                                activity::Button::new("Discord", "https://discord.gg/tnKvwNt3H4"),
                            ]);

                        if let Err(e) = c.set_activity(act) {
                            println!("[RPC] set_activity error: {e} (reset client)");
                            client = None; // falls Discord RPC die Verbindung verloren hat
                        }
                    } else {
                        println!("[RPC] set_activity ignored (not connected)");
                    }
                }

                RpcMsg::Clear => {
                    if let Some(c) = client.as_mut() {
                        if let Err(e) = c.clear_activity() {
                            println!("[RPC] clear error: {e} (reset client)");
                            client = None;
                        }
                    } else {
                        println!("[RPC] clear ignored (not connected)");
                    }
                }
            }
        }
    });

    tx
}

#[tauri::command]
fn discord_connect(client_id: String) -> Result<(), String> {
    let tx = {
        let mut guard = RPC_TX.lock().unwrap();
        if guard.is_none() {
            *guard = Some(start_rpc_worker());
        }
        guard.as_ref().unwrap().clone()
    };

    tx.send(RpcMsg::Connect { client_id })
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn discord_set_activity(state: String, details: String) -> Result<(), String> {
    let tx_opt = RPC_TX.lock().unwrap().clone();
    if let Some(tx) = tx_opt {
        tx.send(RpcMsg::SetActivity { state, details })
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn discord_clear() -> Result<(), String> {
    let tx_opt = RPC_TX.lock().unwrap().clone();
    if let Some(tx) = tx_opt {
        tx.send(RpcMsg::Clear).map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            discord_connect,
            discord_set_activity,
            discord_clear
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
