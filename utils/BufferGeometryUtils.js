import { BufferAttribute, BufferGeometry, TriangleFanDrawMode, TriangleStripDrawMode, TrianglesDrawMode } from 'three';

function toTrianglesDrawMode( geometry, drawMode ) {
	if ( drawMode === TrianglesDrawMode ) {
		console.warn( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): drawMode is TrianglesDrawMode, nothing to convert.' );
		return geometry;
	}
	if ( drawMode === TriangleStripDrawMode || drawMode === TriangleFanDrawMode ) {
		const index = geometry.getIndex();
		if ( index === null ) {
			const indices = [];
			const position = geometry.getAttribute( 'position' );
			if ( position !== undefined ) {
				for ( let i = 0; i < position.count; i++ ) indices.push( i );
			} else {
				console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute.' );
				return geometry;
			}
			geometry.setIndex( indices );
		}
		const numberOfTriangles = geometry.index.count - 2;
		const newIndices = [];
		if ( drawMode === TriangleStripDrawMode ) {
			for ( let i = 0; i < numberOfTriangles; i++ ) {
				if ( i % 2 === 0 ) {
					newIndices.push( geometry.index.getX( i ), geometry.index.getX( i + 1 ), geometry.index.getX( i + 2 ) );
				} else {
					newIndices.push( geometry.index.getX( i + 2 ), geometry.index.getX( i + 1 ), geometry.index.getX( i ) );
				}
			}
		} else {
			for ( let i = 1; i <= numberOfTriangles; i++ ) {
				newIndices.push( geometry.index.getX( 0 ), geometry.index.getX( i ), geometry.index.getX( i + 1 ) );
			}
		}
		if ( newIndices.length / 3 !== numberOfTriangles ) {
			console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.' );
		}
		const newGeometry = geometry.clone();
		newGeometry.setIndex( newIndices );
		newGeometry.clearGroups();
		return newGeometry;
	} else {
		console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:', drawMode );
		return geometry;
	}
}

export { toTrianglesDrawMode };
