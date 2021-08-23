import {useState, useEffect, useRef} from "react";

const dateFormat = "DD-MM-YYYY";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
    "October", "November", "December"];
const MONTH_SHORT_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatDateForDisplay = date => {
    const formattedDay = DAYS[date.getDay()];
    const formattedDate = ("0" + date.getDate()).slice(-2); // appends 0 (zero) in single digit date

    const formattedMonth = MONTH_NAMES[date.getMonth()];
    const formattedMonthShortName = MONTH_SHORT_NAMES[date.getMonth()];
    const formattedMonthInNumber = ("0" + (parseInt(date.getMonth()) + 1)).slice(-2);

    const formattedYear = date.getFullYear();

    if (dateFormat === "DD-MM-YYYY") {
        return `${formattedDate}-${formattedMonthInNumber}-${formattedYear}`; // 02-04-2021
    }
    if (dateFormat === "YYYY-MM-DD") {
        return `${formattedYear}-${formattedMonthInNumber}-${formattedDate}`; // 2021-04-02
    }
    if (dateFormat === "D d M, Y") {
        return `${formattedDay} ${formattedDate} ${formattedMonthShortName} ${formattedYear}`; // Tue 02 Mar 2021
    }
    return `${formattedDay} ${formattedDate} ${formattedMonth} ${formattedYear}`;
};

const getDateFromDatepickerString = dateString => {
    if (dateFormat === "DD-MM-YYYY") {
        return new Date(dateString.substring(6, 10), parseInt(dateString.substring(3, 5)) - 1, dateString.substring(0, 2));
    }
    return new Date();
};

export default function DatePicker() {
    const currentDate = new Date();

    const [datepickerValue, setDatepickerValue] = useState(formatDateForDisplay(currentDate));
    const [showDatepicker, setShowDatepicker] = useState(false);
    const [month, setMonth] = useState(currentDate.getMonth());
    const [year, setYear] = useState(currentDate.getFullYear());
    const [totalDayInTheMonth, setTotalDayInTheMonth] = useState(new Date(year, month, 0).getDate());
    const [firstDayOfMonth, setFirstDayOfMonth] = useState(new Date(year, month, 1).getDay());
    const [startYear, setStartYear] = useState(1900);
    const [endYear, setEndYear] = useState(2030);

    const isSelectedDate = date => datepickerValue === formatDateForDisplay(new Date(year, month, date));

    const isToday = date => new Date().toDateString() === new Date(year, month, date).toDateString();

    const setMonthlyData = (y, m) => {
        setTotalDayInTheMonth(new Date(y, m + 1, 0).getDate());
        setFirstDayOfMonth(new Date(y, m, 1).getDay());
    };
    const getColor = date => {
        if (isToday(date)) return 'bg-indigo-200';
        else if (isSelectedDate(date)) return 'text-gray-600 bg-indigo-100 hover:bg-indigo-200';
        else return 'bg-white text-black hover:bg-gray-200';
    };

    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }

    const yearRange = range(startYear, endYear);

    const blanks = Array.from({length: firstDayOfMonth}, (_) => <td>{""}</td>);
    const daysInMonth = Array.from({length: totalDayInTheMonth}, (_, i) => i + 1);
    const daysInMonthTdArray = daysInMonth.map((d, i) => <td
        onClick={_ => setDatepickerValue(formatDateForDisplay(new Date(year, month, d))) || setShowDatepicker(!showDatepicker)}>
        <div className={"rounded-full w-8 h-8 flex flex-col justify-center items-center " + getColor(d)}>{d}</div>
    </td>);
    const totalSlots = [...blanks, ...daysInMonthTdArray];

    const ref = useRef();

    useOnClickOutside(ref, () => setShowDatepicker(false));

    function useOnClickOutside(ref, handler) {
        useEffect(
            () => {
                const listener = (event) => {
                    if (!ref.current || ref.current.contains(event.target)) {
                        return;
                    }
                    handler(event);
                };

                document.addEventListener("mousedown", listener);
                document.addEventListener("touchstart", listener);

                return () => {
                    document.removeEventListener("mousedown", listener);
                    document.removeEventListener("touchstart", listener);
                };
            },
            [ref, handler]
        );
    }

    const rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
        if (i % 7 !== 0) {
            cells.push(row);
        } else {
            rows.push(cells);
            cells = [];
            cells.push(row);
        }
        if (i === totalSlots.length - 1) {
            rows.push(cells);
        }
    });
    const monthTableData = rows.map((d, i) => <tr>{d}</tr>);
    return <div className="h-screen w-screen flex-1 items-center justify-center bg-gray-200 w-96">
        <div
            className="container mx-auto">
            <div className="mb-5">
                <div className="relative">
                    <input
                        type="text"
                        onClick={_ => setShowDatepicker(!showDatepicker) ||
                            setMonthlyData(getDateFromDatepickerString(datepickerValue).getFullYear(), getDateFromDatepickerString(datepickerValue).getMonth()) ||
                            setYear(getDateFromDatepickerString(datepickerValue).getFullYear()) || setMonth(getDateFromDatepickerString(datepickerValue).getMonth())
                        }
                        value={datepickerValue}
                        onKeyDown={({key}) => setShowDatepicker(key !== 'Escape')}
                        className="w-full pl-4 pr-10 py-3 leading-none rounded-lg shadow-sm focus:outline-none focus:shadow-outline text-gray-600 font-medium"
                        placeholder="Select date"/>

                    {showDatepicker &&
                    <div className="absolute top-0 left-0 p-4 mt-12 bg-white rounded-lg shadow" ref={ref}>
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                    <span className="text-lg font-bold text-gray-800">
                                        <select
                                            onChange={event => setMonthlyData(year, parseInt(event.target.value)) || setMonth(parseInt(event.target.value))}>
                                            {MONTH_NAMES.map((monthFullName, i) =>
                                                (month === i ?
                                                    <option value={i} selected>{monthFullName}</option> :
                                                    <option value={i}>{monthFullName}</option>)
                                            )}
                                        </select>
                                    </span>
                                <span className="ml-1 text-lg font-normal text-gray-600"><select
                                    onChange={event => setMonthlyData(parseInt(event.target.value), month) || setYear(parseInt(event.target.value))}>
                                            {yearRange.map((yearNumber, i) =>
                                                (yearNumber === year ?
                                                    <option value={yearNumber} selected>{yearNumber}</option> :
                                                    <option value={yearNumber}>{yearNumber}</option>)
                                            )}
                                        </select></span>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="inline-flex p-1 transition duration-100 ease-in-out rounded-full cursor-pointer focus:outline-none focus:shadow-outline hover:bg-gray-100"
                                    onClick={_ => {
                                        (month === 0) ? setMonthlyData(year - 1, 11) || setYear(year - 1) || setMonth(11) :
                                            setMonthlyData(year, month - 1) || setMonth(month - 1)
                                    }
                                    }>
                                    <svg className="inline-flex w-6 h-6 text-gray-400" fill="none"
                                         viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M15 19l-7-7 7-7"/>
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex p-1 transition duration-100 ease-in-out rounded-full cursor-pointer focus:outline-none focus:shadow-outline hover:bg-gray-100"
                                    onClick={_ => {
                                        (month === 1) ? setMonthlyData(year + 1, 0) || setYear(year + 1) || setMonth(0) :
                                            setMonthlyData(year, month + 1) || setMonth(month + 1)
                                    }
                                    }>
                                    <svg className="inline-flex w-6 h-6 text-gray-400" fill="none"
                                         viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <table>
                            <thead>
                            <tr>
                                {DAYS.map((day, i) =>
                                    <th className=" w-12" key={i}>{day}</th>
                                )}
                            </tr>
                            </thead>
                            <tbody>
                            {monthTableData}
                            </tbody>
                        </table>
                    </div>
                    }
                </div>
            </div>
        </div>
    </div>;
}