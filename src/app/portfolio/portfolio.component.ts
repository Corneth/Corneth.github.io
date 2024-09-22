import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, HostListener, NgModule } from '@angular/core';

declare var data: any;

@Component({
	selector: 'app-portfolio',
	templateUrl: './portfolio.component.html',
	changeDetection: ChangeDetectionStrategy.Default,
	styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements AfterViewInit {
	public tabs = data['PortfolioProjects'];
	public activePortfolioTab = "data-science";
	activeElements: any = {};
	public selector: any;

	constructor(public changeDetectorRef: ChangeDetectorRef) {
		changeDetectorRef.detach();
	}

	ngOnInit(): void {
		// Detect initial changes
		this.changeDetectorRef.detectChanges();
	}

	ngAfterViewInit() {
		// Initialize the active elements for tab switching
		for (const tab of this.tabs['NavTabs']) {
			if (!this.activeElements[tab.id]) {
				this.activeElements[tab.id] = document.getElementById(tab.id + '-tab')!!;
			}
			this.activeElements[tab.id].addEventListener('click', (event: any) => event.preventDefault());
		}

		this.changePortfolioTab(this.activePortfolioTab);
	}

	@HostListener('window:resize', ['$event'])
	onWindowResize() {
		this.updateSelector(this.activePortfolioTab);
	}

	changePortfolioTab(tab: string) {
		this.updateSelector(tab);
		this.activePortfolioTab = tab;
		this.changeDetectorRef.markForCheck();
		this.changeDetectorRef.detectChanges();
	}

	updateSelector(tab: string) {
		if (!this.selector) {
			this.selector = document.getElementById('portfolio-selector');
		}
		this.selector.style.width = `${this.activeElements[tab].offsetWidth}px`;
		this.selector.style.left = `${this.activeElements[tab].offsetLeft}px`;
	}
	replaceDashesWithSpaces(text: string): string {
		if (!text) {
			return '';
		}
		return text.replace(/-/g, ' ');

	}
}
