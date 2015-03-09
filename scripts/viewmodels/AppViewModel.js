'use strict';

define(
    [
        'knockout', 'pager',

        'models/AppModel'
    ],
    function(
        ko, pager,

        AppModel
    ) {
        function AppViewModel() {
            var self = this;

            self.app = AppModel.instance();

            self.searchText = ko.observable('');

            self.currentSearchScope = ko.observable(0);
            self.searchScopes = [
                'поиск везде',
                'поиск только в первой секции',
                'поиск только во второй секции',
                'поиск только в третьей секции',
                'поиск только в четвёртой секции'
            ];

            self.entryOnShowCount = ko.observable(3);
            self.paginationMaxChunks = ko.observable(3);
            self.currentStage = ko.observable(1);
            self.paginationId = ko.observable(1);
            self.calculatePaginationId = ko.computed(function() {
                this.paginationId(
                    Math.floor(this.currentStage() / this.entryOnShowCount()) + 1);  // Pagination start on 1
            }, this);

            self.calculateCurrentStageWhithPaginationId = function() {
                self.currentStage((self.paginationId() - 1) * self.entryOnShowCount());  // Pagination start on 1
            };
            self.setPaginationId = function(id) {
                var chunksCount = self.paginationChunsCount();
                if (id <= 0) {
                    id = 1;
                } else if (id > chunksCount) {
                    id = chunksCount;
                }
                self.paginationId(id);
                self.calculateCurrentStageWhithPaginationId();
            };
            self.paginationChunsCount = ko.pureComputed(function() {
                var chunksCount = Math.floor(this.getRelevantSearchResult().length / self.entryOnShowCount());
                return chunksCount;
            }, this);

            self.getPaginationChunks = ko.pureComputed(function() {
                var paginationId = this.paginationId(),
                    paginationMaxChunks = this.paginationMaxChunks(),
                    middle = Math.floor(paginationMaxChunks / 2),
                    paginationCountLength = this.paginationChunsCount(),
                    chunkSliceStart = 1,
                    chunkSliceEnd = paginationMaxChunks <= paginationCountLength ?
                                        paginationMaxChunks : paginationCountLength;

                if (paginationId > middle) {
                    chunkSliceEnd = paginationId + middle;
                    chunkSliceEnd = chunkSliceEnd <= paginationCountLength ?
                                        chunkSliceEnd : paginationCountLength;
                    chunkSliceStart = paginationId - middle;
                    var surpluses = paginationMaxChunks - (chunkSliceEnd - chunkSliceStart);
                    // Перерасчет начала с учетом максимальной длины когда мы дошли до конца
                    if (surpluses && (chunkSliceStart - surpluses)) {
                        chunkSliceStart -= surpluses;
                    }
                }

                var result = [];
                for (var i=chunkSliceStart; i <= chunkSliceEnd; i++) {
                    result.push(i);
                }
                return result;
            }, this);

            self.getRelevantSearchResult = ko.pureComputed(function() {
                var text = this.searchText();

                if (!text) { return null; }

                var fuses = this.app.fuses;
                var currentSearchScope = this.currentSearchScope();

                var result = fuses[currentSearchScope].search(text);
                return result;
            }, this);

            self.getSlicedRelevantSearchResult = ko.pureComputed(function() {
                var result = this.getRelevantSearchResult(),
                    currentPoint = this.currentStage(),
                    endPoint =  currentPoint + self.entryOnShowCount();

                if (endPoint > result.length) {
                    endPoint = result.length;
                }

                return result.slice(currentPoint, endPoint);
            }, this);

            self.isCurrentPage = function(pageid) {
                var page = pager.page.find(pageid);
                return page.isVisible;
            };
        }

        return AppViewModel;
    }
);
