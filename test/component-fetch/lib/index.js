'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp;
// import {  getBSGlobal } from '&/helper/index.js';


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./index.css');

var _Selecte = require('./Selecte');

var _Selecte2 = _interopRequireDefault(_Selecte);

var _takeData = require('./takeData');

var _takeData2 = _interopRequireDefault(_takeData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import ProjectListss from './projectList/index';
var goUp = [],
    progressNum = [];
var AssessProject = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(AssessProject, _Component);

    function AssessProject(props) {
        (0, _classCallCheck3.default)(this, AssessProject);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

        _this.rollNum = function () {
            var upNum = [0, 0, 0],
                stop = [],
                flag = 0;
            var interval = setInterval(function () {
                _this.state.progress.map(function (item, index) {
                    var num = (item * 100 + 300) / 100;
                    if (num > progressNum[index]) {
                        progressNum[index] == 100 ? num = 100 : num = parseFloat(progressNum[index]);
                        if (stop[index] !== 101) {
                            flag += 1;
                        }
                        stop[index] = 101;
                    }
                    switch (num) {
                        case 100:
                            upNum[index] = 100;
                            break;
                        case 0:
                            upNum[index] = 0;
                            break;
                        default:
                            upNum[index] = num.toFixed(2);
                            break;
                    }
                    if (flag == progressNum.length) {
                        clearInterval(interval);
                    }
                });
                _this.setState({
                    progress: upNum
                });
            }, 50);
        };

        _this.showList = function (e) {
            _this.setState({
                showList: true
            });
            e.stopPropagation();
        };

        _this.selected = function (index, item, e) {
            e.stopPropagation();
            var currentOption = _this.state.currentOption;

            if (item == currentOption) {
                _this.setState({
                    showList: false
                });
                return;
            } else {
                _this.setState({
                    showList: false,
                    currentOption: item
                });
            };
            var tag = void 0;
            switch (index) {
                case 0:
                    tag = 3;
                    break;
                case 1:
                    tag = 1;
                    break;
                default:
                    tag = 2;
                    break;
            }
            _this.handleFetchData(tag, 3);
        };

        _this.closeSelecte = function () {
            var showList = _this.state.showList;

            if (showList) {
                _this.setState({
                    showList: false
                });
            }
        };

        _this.getProgress = function (item, index) {
            var sum = item.inviteNumber,
                completed = item.completeNumber;
            var progress = completed / sum * 100;
            if (sum == 0) progress = 0;
            if (completed % sum !== 0) {
                progress = progress.toFixed(2);
            }
            var upNum = 100 - 14 - progress + "%";
            if (sum == 0 || completed == 0) upNum = "150px";
            goUp[index] = upNum;
            progressNum[index] = progress;
            return progress;
        };

        _this.getBGC = function (progress, num) {
            var bgc = "";
            if (progress < 20) {
                bgc = " bgc20";
            } else if (20 <= progress && progress < 50) {
                bgc = " bgc50";
            } else if (50 <= progress && progress < num) {
                bgc = " bgc" + num;
            } else if (num <= progress && progress <= 100) {
                bgc = " bgc100";
            };
            return bgc;
        };

        _this.state = {
            showList: false,
            currentOption: "全部项目",
            up: ["150px", "150px", "150px"],
            progress: [0, 0, 0],
            transition: "3s",
            isFetching: true
        };
        return _this;
    }

    AssessProject.prototype.handleFetchData = function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(tag, count) {
            var _this2 = this;

            var response;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _takeData2.default)({
                                url: '/Index/GetHomeDisplayProjectInfo',
                                params: { tag: tag, count: count }
                            });

                        case 2:
                            response = _context.sent;

                            response = JSON.parse(response);

                            this.setState({
                                projectData: response,
                                transition: "0s",
                                up: ["164px", "164px", "164px"],
                                isFetching: false,
                                progress: [0, 0, 0]
                            });
                            setTimeout(function () {
                                _this2.setState({
                                    transition: "3s",
                                    up: goUp
                                });
                            }, 10);
                            this.rollNum();

                        case 7:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function handleFetchData(_x, _x2) {
            return _ref.apply(this, arguments);
        }

        return handleFetchData;
    }();

    AssessProject.prototype.componentDidMount = function componentDidMount() {
        this.handleFetchData(3, 3);
    };

    AssessProject.prototype.componentWillMount = function componentWillMount() {};

    AssessProject.prototype.render = function render() {
        var _this3 = this;

        var _state = this.state,
            isFetching = _state.isFetching,
            showList = _state.showList,
            currentOption = _state.currentOption,
            projectData = _state.projectData,
            transition = _state.transition;

        var list = ["全部项目", "最近的项目", "我创建的项目"];
        if (isFetching) {
            return _react2.default.createElement('div', null);
        }
        if (!projectData.projectinfolist || projectData.projectinfolist.length == 0 && currentOption == "全部项目") {
            return _react2.default.createElement(
                'div',
                { className: 'assess-project' },
                _react2.default.createElement(
                    'div',
                    { className: 'header' },
                    _react2.default.createElement(
                        'p',
                        { className: 'text' },
                        '\u6D4B\u8BC4\u9879\u76EE'
                    )
                ),
                _react2.default.createElement('div', { className: 'noting', style: { "marginTop": "146px" } })
            );
        }
        if (!projectData.projectinfolist || projectData.projectinfolist.length == 0) {
            return _react2.default.createElement(
                'div',
                { className: 'assess-project', onClick: function onClick() {
                        _this3.closeSelecte();
                    } },
                _react2.default.createElement(
                    'div',
                    { className: 'header' },
                    _react2.default.createElement(
                        'p',
                        { className: 'text' },
                        '\u6D4B\u8BC4\u9879\u76EE'
                    )
                ),
                _react2.default.createElement(_Selecte2.default, { showList: showList, showDiv: this.showList.bind(this),
                    currentOption: currentOption, list: list, selected: this.selected.bind(this) }),
                _react2.default.createElement('div', { className: 'noting' })
            );
        }
        return _react2.default.createElement(
            'div',
            { className: 'assess-project', onClick: function onClick() {
                    _this3.closeSelecte();
                } },
            _react2.default.createElement(
                'div',
                { className: 'header' },
                _react2.default.createElement(
                    'p',
                    { className: 'text' },
                    '\u6D4B\u8BC4\u9879\u76EE'
                )
            ),
            _react2.default.createElement(_Selecte2.default, { showList: showList, showDiv: this.showList.bind(this),
                currentOption: currentOption, list: list, selected: this.selected.bind(this) }),
            _react2.default.createElement(
                'div',
                { className: 'project-list' },
                projectData.projectinfolist.map(function (item, index) {
                    var progress = _this3.getProgress(item, index);
                    var up = _this3.state.up[index];

                    var bgc = _this3.getBGC(progress, 80);
                    var numBgc = _this3.getBGC(progress, 56);
                    var sploosh1 = "sploosh1 common " + bgc,
                        sploosh2 = "sploosh2 common " + bgc;
                    var textColor = void 0;
                    progress < 70 ? textColor = "black" : textColor = "#fff";

                    // let projectName =item.name.length > 13 ? item.name.slice(0,12) + "..." : item.name;

                    return _react2.default.createElement(
                        'a',
                        { href: item.particularsUrl, target: '_blank', key: index, className: 'project-item' },
                        _react2.default.createElement(
                            'div',
                            { className: item.state == 2 ? "state" : "state finish" },
                            item.state == 2 ? "进行中" : "已结束"
                        ),
                        _react2.default.createElement('div', { className: 'project-name', dangerouslySetInnerHTML: { __html: item.name } }),
                        _react2.default.createElement(
                            'div',
                            { className: 'time-person' },
                            _react2.default.createElement(
                                'span',
                                { className: 'time common' },
                                item.createDate.slice(0, 10)
                            ),
                            _react2.default.createElement(
                                'span',
                                { className: 'person common' },
                                item.createBy.length > 9 ? item.createBy.slice(0, 8) + "..." : item.createBy
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: "progress" + bgc },
                            _react2.default.createElement('div', { className: 'per100', style: { display: 80 <= progress ? 'block' : 'none' } }),
                            _react2.default.createElement(
                                'div',
                                { className: "number" + numBgc },
                                _this3.state.progress[index],
                                _react2.default.createElement(
                                    'span',
                                    { style: { "fontSize": "14px" } },
                                    '%'
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'text', style: { color: progress > 45 ? "#ffffff" : "#4b5f6a" } },
                                '\u5B8C\u6210\u5EA6'
                            ),
                            _react2.default.createElement('div', { className: sploosh1, style: { top: up, transition: transition } }),
                            _react2.default.createElement('div', { className: sploosh2, style: { top: up, transition: transition } })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'showNum' },
                            _react2.default.createElement(
                                'div',
                                { className: 'conpleted' },
                                _react2.default.createElement(
                                    'object',
                                    null,
                                    _react2.default.createElement('a', { href: item.participantsUrl, target: '_blank', className: 'img' }),
                                    _react2.default.createElement(
                                        'a',
                                        { href: item.participantsUrl, target: '_blank', className: 'content' },
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'text' },
                                            '\u5B8C\u6210\u4EBA\u6B21'
                                        ),
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'num' },
                                            item.completeNumber
                                        )
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'invited diff' },
                                _react2.default.createElement(
                                    'object',
                                    null,
                                    _react2.default.createElement('a', { href: item.participantsUrl, target: '_blank', className: 'img' }),
                                    _react2.default.createElement(
                                        'a',
                                        { href: item.participantsUrl, target: '_blank', className: 'content' },
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'text' },
                                            '\u603B\u4EBA\u6B21'
                                        ),
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'num' },
                                            item.inviteNumber
                                        )
                                    )
                                )
                            )
                        )
                    );
                })
            ),
            _react2.default.createElement(
                'div',
                { className: 'bottomURL' /* style={{ display: projectData.projectNum > 3 ? "black" : "none" }}*/ },
                _react2.default.createElement(
                    'object',
                    null,
                    _react2.default.createElement(
                        'a',
                        { href: projectData.listUrl, target: '_self', className: 'text' },
                        '\u67E5\u770B\u66F4\u591A',
                        _react2.default.createElement('span', { className: 'bttom-icon' })
                    )
                )
            )
        );
    };

    return AssessProject;
}(_react.Component), _class.displayTitle = "测评项目", _temp);
exports.default = AssessProject;
module.exports = exports['default'];