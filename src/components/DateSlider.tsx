import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Mousewheel } from "swiper/modules";
import { format, addDays, isSameDay, isAfter } from "date-fns";
import "swiper/css";

interface DateSliderProps {
  selectedDate: Date;
  handleDateChange: (date: Date) => void;
}

const TOTAL_DAYS = 1000;
const ITEM_WIDTH = 50;

const getDateFromIndex = (index: number): Date => {
  const today = new Date();
  return addDays(today, index - Math.floor(TOTAL_DAYS / 2));
};

const DateButton = ({
  index,
  selectedDate,
  handleDateChange,
}: {
  index: number;
  selectedDate: Date;
  handleDateChange: (date: Date) => void;
}) => {
  const date = getDateFromIndex(index);
  const today = new Date();

  return (
    <div className="w-full">
      <button
        onClick={() => handleDateChange(date)}
        disabled={isAfter(date, today)}
        className={`px-2 py-6 rounded-2xl hover:text-white transition-colors duration-300 ease-out cursor-pointer min-w-16 ${
          isAfter(date, today) &&
          "opacity-50 pointer-events-none cursor-not-allowed"
        } ${
          isSameDay(date, selectedDate)
            ? "bg-zinc-900 text-white"
            : "hover:bg-zinc-100/90"
        }`}
      >
        <span
          className={`font-bold text-sm ${
            isSameDay(date, selectedDate) ? "text-white" : "text-zinc-500"
          }`}
        >
          {format(date, "E")[0]}
        </span>
        <br />
        <span
          className={`text-base font-bold ${
            isSameDay(date, selectedDate) ? "text-white" : "text-zinc-900"
          }`}
        >
          {format(date, "dd")}
        </span>
      </button>
    </div>
  );
};

export const DateSlider = ({
  selectedDate,
  handleDateChange,
}: DateSliderProps) => {
  const todayIndex = Math.floor(TOTAL_DAYS / 2);

  return (
    <div className="mb-4 bg-white border border-zinc-200/70 shadow-lg rounded-b-[1.5rem] py-4">
      <h3 className="text-[26px] leading-none font-black px-4">todos</h3>
      <Swiper
        modules={[Navigation, A11y, Mousewheel]}
        spaceBetween={16}
        slidesPerView="auto"
        centeredSlides={true}
        initialSlide={todayIndex}
        mousewheel={{
          sensitivity: 2,
        }}
      >
        {Array.from({ length: TOTAL_DAYS }).map((_, index) => (
          <SwiperSlide key={index} style={{ width: ITEM_WIDTH }}>
            <DateButton
              index={index}
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
