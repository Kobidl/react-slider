import React, { Component } from 'react';
import Slider, { Rail, Handles, Tracks } from 'react-compound-slider'
import PropTypes from "prop-types";

const sliderStyle = {
    position: 'relative',
    width: '100%',
}

const railStyle = {
    position: 'absolute',
    width: '100%',
    height: 8,
    borderRadius: 7,
    cursor: 'pointer',
    backgroundColor: 'rgb(155,155,155)',
}



// *******************************************************
// HANDLE COMPONENT
// *******************************************************
export function Handle({ handle: { id, value, percent }, getHandleProps }) {
    return (
        <div
            role="slider"
            aria-valuenow={value}
            style={{
                left: `${percent}%`,
                position: "absolute",
                marginLeft: "-11px",
                marginTop: "-9px",
                zIndex: 2,
                width: 24,
                height: 24,
                cursor: "pointer",
                borderRadius: "50%",
                boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.2)",
                backgroundColor: "#ff3d00"
            }}
            {...getHandleProps(id)}
        />
    );
}

Handle.propTypes = {
    domain: PropTypes.array.isRequired,
    handle: PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired
    }).isRequired,
    getHandleProps: PropTypes.func.isRequired
};

// *******************************************************
// TRACK COMPONENT
// *******************************************************
export function Track({ source, target, getTrackProps }) {
    return (
        <div
            style={{
                position: "absolute",
                height: 8,
                zIndex: 1,
                backgroundColor: "#ff3d00",
                borderRadius: 4,
                cursor: "pointer",
                left: `${source.percent}%`,
                width: `${target.percent - source.percent}%`
            }}
            {...getTrackProps()}
        />
    );
}

Track.propTypes = {
    source: PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired
    }).isRequired,
    target: PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired
    }).isRequired,
    getTrackProps: PropTypes.func.isRequired
};

// *******************************************************
// TICK COMPONENT
// *******************************************************
export function Tick({ tick, count, format }) {
    return (
        <div>
            <div
                style={{
                    position: "absolute",
                    marginTop: 14,
                    width: 1,
                    height: 5,
                    backgroundColor: "rgb(200,200,200)",
                    left: `${tick.percent}%`
                }}
            />
            <div
                style={{
                    position: "absolute",
                    marginTop: 22,
                    fontSize: 10,
                    fontFamily: "Arial",
                    textAlign: "center",
                    marginLeft: `${-(100 / count) / 2}%`,
                    width: `${100 / count}%`,
                    left: `${tick.percent}%`
                }}
            >
                {format(tick.value)}
            </div>
        </div>
    );
}

Tick.propTypes = {
    tick: PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired
    }).isRequired,
    count: PropTypes.number.isRequired,
    format: PropTypes.func.isRequired
};

Tick.defaultProps = {
    format: d => d
};

export default class SliderStages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            values: this.props.defaultValues.slice(),
            update: this.props.defaultValues.slice(),
        }
    }

    onUpdate = update => {
        this.setState({ update })
        console.log("updated")
        if (this.props.onUpadte)
            this.props.onUpadte(update);
    }

    onChange = values => {
        this.setState({ values })
        console.log("changed")
        if (this.props.onChange)
            this.props.onChange(values);
    }

    render() {
        var { values } = this.state;
        var { domain } = this.props;
        return (
            <div>
                <Slider
                    mode={1}
                    step={1}
                    domain={domain}
                    rootStyle={sliderStyle}
                    onUpdate={this.onUpdate}
                    onChange={this.onChange}
                    values={values}
                >
                    <Rail>
                        {({ getRailProps }) => (
                            <div style={railStyle} {...getRailProps()} />
                        )}
                    </Rail>
                    <Handles>
                        {({ handles, getHandleProps }) => (
                            <div className="slider-handles">
                                {handles.map(handle => (
                                    <Handle
                                        key={handle.id}
                                        handle={handle}
                                        domain={domain}
                                        getHandleProps={getHandleProps}
                                    />
                                ))}
                            </div>
                        )}
                    </Handles>
                    <Tracks left={false} right={false}>
                        {({ tracks, getTrackProps }) => (
                            <div className="slider-tracks">
                                {tracks.map(({ id, source, target }) => (
                                    <Track
                                        key={id}
                                        source={source}
                                        target={target}
                                        getTrackProps={getTrackProps}
                                    />
                                ))}
                            </div>
                        )}
                    </Tracks>

                </Slider>
            </div>
        );
    }
}
