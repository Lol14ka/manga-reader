import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageLoadEventData,
  NativeScrollEvent,
  NativeTouchEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';

import { aspectRatio, getRatioHeight } from '../utils/aspectRatio';
import { ImageData, ImageSize, PanelProps } from './interfaces/Reader';

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  containerCentered: {
    flex: 1,
    width: screen.width,
    height: screen.height,
    justifyContent: "center",
    backgroundColor: "white",
  },
  fixedHeader: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#eeeee4",
    flexDirection: "row",
    justifyContent: "space-around",
    zIndex: 2,
    elevation: 2,
    position: "absolute",
    width: "100%",
    top: 0,
  },
});

export const Panel = (props: PanelProps) => {
  const [imageSize, setImageSize] = useState<ImageSize>();
  const [isCentered, setIsCentered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  function reload() {
    setLoading(true);
    setHasError(false);
  }

  function loadImageSize(evt: ImageLoadEventData) {
    const ratio = aspectRatio(evt.source.width, evt.source.height);
    const calcHeight = getRatioHeight(screen.width, ratio);

    const isMinHeight = calcHeight < screen.height;

    const centered = isMinHeight || !!props.horizontal || !!props.centered;

    setIsCentered(centered);

    const dimensions = {
      width: screen.width,
      height: calcHeight,
    };

    setImageSize(dimensions);

    setLoading(false);
  }

  useEffect(() => {
    if (props.onGetDimensions) {
      if ((imageSize && isCentered) || (!imageSize && (loading || hasError))) {
        props.onGetDimensions({ width: screen.width, height: screen.height });
      }
      if (imageSize && !isCentered) {
        props.onGetDimensions(imageSize);
      }
    }
  }, [loading, hasError, imageSize]);

  if (hasError) {
    return (
      <View style={styles.containerCentered}>
        <TouchableOpacity
          onPress={reload}
          style={{ flexDirection: "row", justifyContent: "center" }}
        >
          <IonIcon name="reload" size={64} color="blue" />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <>
        {loading && (
          <View style={styles.containerCentered}>
            <ActivityIndicator size={64} color="blue" />
          </View>
        )}
        <View style={isCentered ? styles.containerCentered : { flex: 1 }}>
          <Image
            style={{ ...imageSize }}
            source={{ uri: props.data.url }}
            onLoad={(evt) => loadImageSize(evt.nativeEvent)}
            onLoadStart={() => setLoading(true)}
            onError={() => setHasError(true)}
          />
        </View>
      </>
    );
  }
};

export type Direction = "top" | "left" | "right" | "bottom";

interface Location {
  x: number;
  y: number;
}

interface Breakpoint {
  x: number[];
  y: number[];
}

interface ReaderData {
  images: ImageData[];
  horizontal: boolean;
  direction: Direction;
}

export interface ReaderStatus {
  page: number;
  direction: Direction;
}

interface ReaderProps {
  images: ImageData[];
  page?: number;
  direction?: Direction;
  onFinish?: () => void;
  onChange?: (s: ReaderStatus) => void;
}

export const Reader = (props: ReaderProps) => {
  const [data, setData] = useState<ReaderData>();
  const [sizes, setSizes] = useState<ImageSize[]>();
  const [initMove, setInitMove] = useState<Location>();
  const [header, setHeader] = useState(false);
  const [breakpoints, setBreakpoints] = useState<Breakpoint>();
  const [page, setPage] = useState(props.page ?? 0);
  const ref = useRef<ScrollView>();

  function init(direction: Direction, from: Direction | null = null) {
    if (sizes && from) {
      setData(undefined);
      setBreakpoints(undefined);
      if (
        (direction == "right" || direction == "bottom") &&
        (from == "left" || from == "top")
      ) {
        setSizes([...sizes].reverse());
      }
      if (
        (direction == "left" || direction == "top") &&
        (from == "right" || from == "bottom")
      ) {
        setSizes([...sizes].reverse());
      }
    }
    switch (direction) {
      case "top":
        setData({
          images: [...props.images].reverse(),
          direction: "top",
          horizontal: false,
        });
        break;
      case "bottom":
        setData({
          images: [...props.images],
          direction: "bottom",
          horizontal: false,
        });
        break;
      case "right":
        setData({
          images: [...props.images],
          direction: "right",
          horizontal: true,
        });
        break;
      case "left":
        setData({
          images: [...props.images].reverse(),
          direction: "left",
          horizontal: true,
        });
        break;
    }
  }

  useEffect(() => {
    if (props.direction) init(props.direction);
  }, []);

  useEffect(() => {
    calcBreakpoints();
  }, [data, sizes]);

  useEffect(() => {
    if (data && breakpoints) {
      goToPage(page);
    }
  }, [breakpoints]);

  function emitChanges() {
    if (data && page !== undefined && props.onChange) {
      props.onChange({
        direction: data.direction,
        page,
      });
    }
  }

  function startTouch(evt: NativeTouchEvent) {
    if (!data) {
      setInitMove({
        x: evt.pageX,
        y: evt.pageY,
      });
    }
  }

  function endTouch(evt: NativeTouchEvent) {
    if (!data && initMove) {
      // decide scroll
      const dx = initMove.x - Math.abs(evt.pageX);
      const dy = initMove.y - Math.abs(evt.pageY);
      if (dx < -50) {
        // to left
        init("left");
      }
      if (dx > 50) {
        // to right
        init("right");
      }
      if (dy > 100) {
        // to bottom
        init("bottom");
      }
      if (dy < -100) {
        // to top
        init("top");
      }
    }

    if (data) {
      // toggle header
      setHeader(!header);
    }
  }

  function goToPage(n: number) {
    if (data && breakpoints) {
      if (data.horizontal) {
        ref.current?.scrollTo({ x: breakpoints.x[n] });
      } else {
        ref.current?.scrollTo({ y: breakpoints.y[n] });
      }
    }
  }

  useEffect(() => {
    emitChanges();
  }, [page]);

  function calcPage(offset: Location) {
    if (data && breakpoints) {
      const t = 100; //threshold
      const points = data.horizontal ? breakpoints.x : breakpoints.y;
      let cb: (n: number) => boolean = () => false;
      if (data.direction == "top") cb = (y: number) => offset.y + t >= y;
      if (data.direction == "bottom") cb = (y: number) => offset.y <= y + t;
      if (data.direction == "left") cb = (x: number) => offset.x + t >= x;
      if (data.direction == "right") cb = (x: number) => offset.x <= x + t;
      if (cb) {
        const [point] = points.filter(cb);
        if (point !== undefined) {
          const i = points.indexOf(point);
          if (i !== page) {
            setPage(i);
          }
        }
      }
    }
  }

  function calcBreakpoints() {
    if (data && sizes) {
      const breakpoints: Breakpoint = {
        x: [],
        y: [],
      };
      let x = 0;
      let y = 0;
      let i = 0;
      do {
        breakpoints.x[i] = x;
        breakpoints.y[i] = y;
        i++;
        if (sizes[i]) {
          x += sizes[i].width;
          y += sizes[i].height;
        }
      } while (i < sizes.length);
      if (data.direction == "top") breakpoints.y = breakpoints.y.reverse();
      if (data.direction == "left") breakpoints.x = breakpoints.x.reverse();
      setBreakpoints(breakpoints);
    }
  }

  function updateSize(i: number, size: ImageSize) {
    if (data) {
      let array: ImageSize[];
      if (!sizes) {
        array = Array.from({ length: data.images.length }).fill({
          width: screen.width,
          height: screen.height,
        }) as ImageSize[];
      } else {
        array = sizes;
      }
      array[i] = size;
      setSizes(array);
    }
  }

  function shouldFinish(evt: NativeScrollEvent) {
    if (data && props.onFinish) {
      const t = 20; // threshold

      if (
        !data.horizontal &&
        evt.layoutMeasurement.height + evt.contentOffset.y >=
          evt.contentSize.height - t
      ) {
        props.onFinish();
      }
      if (
        data.horizontal &&
        evt.layoutMeasurement.width + evt.contentOffset.x >=
          evt.contentSize.width - t
      ) {
        props.onFinish();
      }
    }
  }

  return (
    <View>
      <ScrollView
        ref={ref as any}
        onTouchStart={(evt) => startTouch(evt.nativeEvent)}
        onTouchEnd={(evt) => endTouch(evt.nativeEvent)}
        horizontal={data?.horizontal}
        onScroll={(evt) => {
          calcPage(evt.nativeEvent.contentOffset);
          shouldFinish(evt.nativeEvent);
        }}
      >
        {!data && <Panel data={props.images[0]} centered={true} />}
        {data &&
          data.images.map((image, i) => (
            <Panel
              data={image}
              key={image.id}
              horizontal={data.horizontal}
              onGetDimensions={(size) => updateSize(i, size)}
            />
          ))}
      </ScrollView>
      {header && data && (
        <View style={styles.fixedHeader}>
          <TouchableOpacity onPress={() => goToPage(page - 1)}>
            <AntIcon
              style={{
                opacity: page - 1 >= 0 ? 1 : 0,
              }}
              name="arrowleft"
              size={24}
              color="black"
            />
          </TouchableOpacity>

          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{page + 1}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <FaIcon
              style={{ marginLeft: 5, marginRight: 5 }}
              name="arrow-circle-left"
              size={24}
              color={data.direction == "left" ? "blue" : "black"}
              onPress={() => init("left", data.direction)}
            />
            <FaIcon
              style={{ marginLeft: 5, marginRight: 5 }}
              name="arrow-circle-right"
              size={24}
              color={data.direction == "right" ? "blue" : "black"}
              onPress={() => init("right", data.direction)}
            />
            <FaIcon
              style={{ marginLeft: 5, marginRight: 5 }}
              name="arrow-circle-up"
              size={24}
              color={data.direction == "top" ? "blue" : "black"}
              onPress={() => init("top", data.direction)}
            />
            <FaIcon
              style={{ marginLeft: 5, marginRight: 5 }}
              name="arrow-circle-down"
              size={24}
              color={data.direction == "bottom" ? "blue" : "black"}
              onPress={() => init("bottom", data.direction)}
            />
          </View>
          <TouchableOpacity onPress={() => goToPage(page + 1)}>
            <AntIcon
              style={{
                opacity: page + 1 < data.images.length ? 1 : 0,
              }}
              name="arrowright"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
