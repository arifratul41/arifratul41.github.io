import {useState} from "react";

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

export default function DatePicker() {

    const currentDate = new Date();

    const [datepickerValue, setDatepickerValue] = useState(formatDateForDisplay(currentDate));
    const [showDatepicker, setShowDatepicker] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [month, setMonth] = useState(currentDate.getMonth());
    const [year, setYear] = useState(currentDate.getFullYear());
    const [blankdays, setBlankdays] = useState([...new Array(new Date(year, month + 1, 0).getDate()).keys()]);
    const [noOfDays, setNoOfDays] = useState([...new Array(new Date(year, month).getDay()).keys()]);

    const isSelectedDate = date => datepickerValue === formatDateForDisplay(new Date(year, month, date));

    const isToday = date => new Date().toDateString() === new Date(year, month, date).toDateString();

    const getDateValue = date => {
        console.log(date);
        setSelectedDate(new Date(year, month, date));
        setDatepickerValue(formatDateForDisplay(selectedDate));
        isSelectedDate(date);
        setShowDatepicker(false);
    };

    const getNoOfDays = (month, year) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dayOfWeek = new Date(year, month).getDay();
        setBlankdays([...new Array(dayOfWeek).keys()]);
        setNoOfDays([...new Array(daysInMonth).keys()]);
    };

    const initDate = newDate => {
        newDate && setSelectedDate(newDate);
        const today = newDate ? new Date(Date.parse(newDate)) : new Date();
        setMonth(today.getMonth());
        setYear(today.getFullYear());
        setDatepickerValue(formatDateForDisplay(today));
    };

    const getColor = date => {
        if (isToday(date)) return 'bg-indigo-200';
        else if (isSelectedDate(date)) return 'text-gray-600 hover:bg-indigo-200';
        else return 'bg-indigo-500 text-white hover:bg-opacity-75';
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-200">
            <div>
                <div
                    onClick={_ => initDate() || (setShowDatepicker(!showDatepicker))}
                    onBlur={_ => setShowDatepicker(false)}
                    className="container mx-auto">
                    <div className="mb-5">
                        <div className="relative">
                            <input type="hidden" name="date" value={datepickerValue}/>
                            <input
                                type="text"
                                value={datepickerValue}

                                onKeyDown={({key}) => setShowDatepicker(key !== 'Escape')}
                                className="w-full pl-4 pr-10 py-3 leading-none rounded-lg shadow-sm focus:outline-none focus:shadow-outline text-gray-600 font-medium"
                                placeholder="Select date"/>
                            <div className="absolute top-0 right-0 px-3 py-2 hover:border-indigo-200 border rounded-lg">
                                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>

                            {showDatepicker &&
                            <div className="absolute top-0 left-0 p-4 mt-12 bg-white rounded-lg shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <span className="text-lg font-bold text-gray-800">{MONTH_NAMES[month]}</span>
                                        <span className="ml-1 text-lg font-normal text-gray-600">{year}</span>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="inline-flex p-1 transition duration-100 ease-in-out rounded-full cursor-pointer focus:outline-none focus:shadow-outline hover:bg-gray-100"
                                            onClick={_ =>
                                                (month === 0 ? (setYear(year - 1) || setMonth(12)) : setMonth(month - 1)) ||
                                                getNoOfDays(month, year)}>
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
                                            onClick={_ =>
                                                (month === 11 ? (setYear(year + 1) || setMonth(0)) : setMonth(month + 1)) ||
                                                getNoOfDays(month, year)}>
                                            <svg className="inline-flex w-6 h-6 text-gray-400" fill="none"
                                                 viewBox="0 0 24 24"
                                                 stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/*Days of a week*/}
                                <div className="flex flex-wrap mb-3 -mx-1">
                                    {DAYS.map((day, i) =>
                                    <div className="px-0.5 mx-1" key={i}>
                                        <div className="text-xs font-medium text-center text-gray-800">{day}</div>
                                    </div>
                                )}
                                </div>

                                <div className="flex flex-wrap mb-3 mx-1">
                                    {blankdays.map((blankday, i) =>
                                        <div className="px-1 mx-2" key={i} onClick={_ => setShowDatepicker(false)}>
                                            <div className="p-1 text-sm text-center border border-transparent">{blankday}</div>
                                        </div>
                                    )}
                                    {noOfDays.map((date, i) =>
                                        <div className="px-0.5 w-1 mb-1" key={i}>
                                            <div className="px-1 mb-1 w-2/12">
                                                <div
                                                    onClick={getDateValue(date)}
                                                    className={"text-sm leading-none leading-loose text-center transition duration-100 ease-in-out rounded-full cursor-pointer " + getColor(date)}>
                                                    {date}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}