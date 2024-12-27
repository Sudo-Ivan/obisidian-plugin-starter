import { App, Plugin, PluginSettingTab, Setting, Notice, TFile, Vault, MarkdownView, TextFileView, WorkspaceLeaf } from 'obsidian';
import * as path from 'path';

interface MyPluginSettings {
    message: string;
    enableFeature: boolean;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    message: 'Hello, World!',
    enableFeature: false
}

export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async onload() {
        console.log('Loading plugin');
        
        await this.loadSettings();

        // Add ribbon icon
        this.addRibbonIcon('dice', 'Greet', () => {
            new Notice(this.settings.message);
        });

        // Add command
        this.addCommand({
            id: 'show-greeting-modal',
            name: 'Show Greeting Modal',
            callback: () => {
                new Notice('Command executed!');
            }
        });

        // Add settings tab
        this.addSettingTab(new MyPluginSettingTab(this.app, this));
    }

    onunload() {
        console.log('Unloading plugin');
    }
}

class MyPluginSettingTab extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName('Greeting Message')
            .setDesc('Message to show when clicking the ribbon icon')
            .addText(text => text
                .setPlaceholder('Enter your message')
                .setValue(this.plugin.settings.message)
                .onChange(async (value) => {
                    this.plugin.settings.message = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable Feature')
            .setDesc('Toggle sample feature')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableFeature)
                .onChange(async (value) => {
                    this.plugin.settings.enableFeature = value;
                    await this.plugin.saveSettings();
                }));
    }
} 