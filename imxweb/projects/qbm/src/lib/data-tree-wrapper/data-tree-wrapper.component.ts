/*
 * ONE IDENTITY LLC. PROPRIETARY INFORMATION
 *
 * This software is confidential.  One Identity, LLC. or one of its affiliates or
 * subsidiaries, has supplied this software to you under terms of a
 * license agreement, nondisclosure agreement or both.
 *
 * You may not copy, disclose, or use this software except in accordance with
 * those terms.
 *
 *
 * Copyright 2021 One Identity LLC.
 * ALL RIGHTS RESERVED.
 *
 * ONE IDENTITY LLC. MAKES NO REPRESENTATIONS OR
 * WARRANTIES ABOUT THE SUITABILITY OF THE SOFTWARE,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, OR
 * NON-INFRINGEMENT.  ONE IDENTITY LLC. SHALL NOT BE
 * LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE
 * AS A RESULT OF USING, MODIFYING OR DISTRIBUTING
 * THIS SOFTWARE OR ITS DERIVATIVES.
 *
 */

import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';

import { CollectionLoadParameters, EntitySchema, IEntity } from 'imx-qbm-dbts';
import { DataSourceToolbarFilter } from '../data-source-toolbar/data-source-toolbar-filters.interface';
import { DataSourceToolbarSettings } from '../data-source-toolbar/data-source-toolbar-settings';
import { SearchResultAction } from '../data-tree/data-tree-search-results/search-result-action.interface';
import { DataTreeComponent } from '../data-tree/data-tree.component';
import { TreeDatabase } from '../data-tree/tree-database';

@Component({
  selector: 'imx-data-tree-wrapper',
  templateUrl: './data-tree-wrapper.component.html',
  styleUrls: ['./data-tree-wrapper.component.scss']
})
export class DataTreeWrapperComponent implements OnChanges {

  public dstSettings: DataSourceToolbarSettings;

  @Input() public database: TreeDatabase;
  @Input() public searchResultAction: SearchResultAction;
  @Input() public entitySchema: EntitySchema;
  @Input() public filters: DataSourceToolbarFilter[];
  @Input() public emptyNodeCaption: string;
  @Input() public selectedEntities: IEntity[] = [];
  @Input() public noDataText = '#LDS#No data';
  @Input() public noDataIcon = 'table';
  @Input() public withMultiSelect: boolean;

  @ViewChild('tree') public treeControl: DataTreeComponent;

  @Output() public nodeSelected = new EventEmitter<IEntity>();
  @Output() public checkedNodesChanged = new EventEmitter();

  public navigationStateTree: CollectionLoadParameters = {};

  public ngOnChanges(): void {
    this.dstSettings = {
      dataSource: { Data: [], totalCount: 0, IsLimitReached: false }, // wird über die database geregelt, darf halt nur nicht leer sein
      entitySchema: this.entitySchema,
      navigationState: this.navigationStateTree,
      filters: this.filters
    };
  }

  public onTreeNavigationStateChanged(newState?: CollectionLoadParameters): void {
    if (newState) {
      this.navigationStateTree = newState;
    }

    if (this.dstSettings) {
      this.dstSettings.navigationState = this.navigationStateTree;
    }

    this.database.reloadData();
    this.treeControl?.reload();
  }

  public onTreeSearch(keywords: string): void {
    this.navigationStateTree = {
      ...this.navigationStateTree,
      ...{ StartIndex: 0, search: keywords }
    };

    if (this.dstSettings) {
      this.dstSettings.navigationState = this.navigationStateTree;
    }
    this.database.reloadData();
    this.treeControl?.reload();
  }

}